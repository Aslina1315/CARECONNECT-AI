from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import logging
import uuid
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any

import bcrypt
import jwt
from pydantic import BaseModel, Field, EmailStr
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ----- Config -----
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
JWT_ALGO = "HS256"
JWT_EXP_HOURS = 24 * 7

mongo = AsyncIOMotorClient(MONGO_URL)
db = mongo[DB_NAME]

app = FastAPI(title="CareConnect AI")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("careconnect")

# ----- Models -----
class SignupIn(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    location: Optional[str] = ""

class TokenOut(BaseModel):
    token: str
    user: UserOut

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

class HelpRequestIn(BaseModel):
    need: str
    location: str
    phone: Optional[str] = ""

class HelpRequestOut(BaseModel):
    id: str
    user_id: str
    raw_need: str
    category: str
    urgency: str
    urgency_score: int
    location: str
    phone: Optional[str] = ""
    created_at: str

class ChatIn(BaseModel):
    message: str
    session_id: Optional[str] = None
    use_gemini: Optional[bool] = True

class ChatOut(BaseModel):
    response: str
    session_id: str
    is_emergency: bool
    category: str

class FindHelpIn(BaseModel):
    need: str
    location: str
    count: Optional[int] = 6

class Organization(BaseModel):
    name: str
    location: str
    description: str
    contact: str
    reason: str
    match_score: int
    priority_score: int
    image: str
    maps_link: str

class FindHelpOut(BaseModel):
    category: str
    urgency: str
    urgency_score: int
    organizations: List[Organization]

class SettingsModel(BaseModel):
    notifications: bool = True
    dark_mode: bool = False
    save_activity: bool = True

# ----- Auth helpers -----
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXP_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ----- Need analysis -----
def analyze_need(text: str):
    t = text.lower()
    if any(w in t for w in ["food", "hungry", "meal", "starv"]):
        category = "Food Support"
    elif any(w in t for w in ["money", "financial", "loan", "rent", "bill"]):
        category = "Financial Support"
    elif any(w in t for w in ["medical", "hospital", "health", "doctor", "medicine"]):
        category = "Medical Support"
    elif any(w in t for w in ["education", "study", "scholarship", "school", "tuition"]):
        category = "Education Support"
    elif any(w in t for w in ["stress", "sad", "depressed", "anxiety", "lonely", "mental"]):
        category = "Mental Health Support"
    else:
        category = "General Help"

    if any(w in t for w in ["urgent", "emergency", "danger", "immediately", "now", "asap"]):
        return category, "HIGH", 90
    if any(w in t for w in ["help", "need", "support", "please"]):
        return category, "MEDIUM", 60
    return category, "LOW", 30

def is_emergency(text: str) -> bool:
    return any(w in text.lower() for w in [
        "suicide", "kill myself", "end my life", "danger", "emergency", "help me now", "i want to die"
    ])

CATEGORY_IMAGES = {
    "Food Support": "https://images.pexels.com/photos/6646987/pexels-photo-6646987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "Medical Support": "https://images.pexels.com/photos/3958422/pexels-photo-3958422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "Mental Health Support": "https://images.pexels.com/photos/3958422/pexels-photo-3958422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "Financial Support": "https://images.pexels.com/photos/6646926/pexels-photo-6646926.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "Education Support": "https://images.pexels.com/photos/6646926/pexels-photo-6646926.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "General Help": "https://images.pexels.com/photos/6646987/pexels-photo-6646987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
}

# ----- LLM helpers -----
def make_chat(session_id: str, system: str) -> LlmChat:
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=system,
    ).with_model("gemini", "gemini-3-flash-preview")

def extract_json_array(text: str):
    if not text:
        return None
    cleaned = text.replace("```json", "").replace("```", "")
    m = re.search(r"\[.*\]", cleaned, re.DOTALL)
    if not m:
        return None
    raw = m.group()
    raw = re.sub(r",\s*}", "}", raw)
    raw = re.sub(r",\s*]", "]", raw)
    try:
        return json.loads(raw)
    except Exception:
        return None

# ----- Routes -----
@api.get("/")
async def root():
    return {"message": "CareConnect AI is running"}

# AUTH
@api.post("/auth/signup", response_model=TokenOut)
async def signup(body: SignupIn):
    existing = await db.users.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    doc = {
        "id": user_id,
        "name": body.name.strip(),
        "email": body.email.lower(),
        "password": hash_password(body.password),
        "phone": "",
        "location": "",
        "settings": {"notifications": True, "dark_mode": False, "save_activity": True},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    token = create_token(user_id)
    return TokenOut(token=token, user=UserOut(**{k: doc[k] for k in ["id", "name", "email", "phone", "location"]}))

@api.post("/auth/login", response_model=TokenOut)
async def login(body: LoginIn):
    user = await db.users.find_one({"email": body.email.lower()})
    if not user or not verify_password(body.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user["id"])
    return TokenOut(
        token=token,
        user=UserOut(id=user["id"], name=user["name"], email=user["email"],
                     phone=user.get("phone", ""), location=user.get("location", "")),
    )

@api.get("/auth/me", response_model=UserOut)
async def me(user=Depends(get_current_user)):
    return UserOut(**{k: user.get(k, "") for k in ["id", "name", "email", "phone", "location"]})

@api.put("/auth/profile", response_model=UserOut)
async def update_profile(body: ProfileUpdate, user=Depends(get_current_user)):
    update = {k: v for k, v in body.model_dump().items() if v is not None}
    if update:
        await db.users.update_one({"id": user["id"]}, {"$set": update})
    fresh = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password": 0})
    return UserOut(**{k: fresh.get(k, "") for k in ["id", "name", "email", "phone", "location"]})

# REQUESTS
@api.post("/requests", response_model=HelpRequestOut)
async def create_request(body: HelpRequestIn, user=Depends(get_current_user)):
    category, urgency, score = analyze_need(body.need)
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "raw_need": body.need,
        "category": category,
        "urgency": urgency,
        "urgency_score": score,
        "location": body.location,
        "phone": body.phone or "",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.requests.insert_one(doc)
    doc.pop("_id", None)
    return HelpRequestOut(**doc)

@api.get("/requests", response_model=List[HelpRequestOut])
async def list_requests(user=Depends(get_current_user)):
    items = await db.requests.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [HelpRequestOut(**i) for i in items]

# DASHBOARD
@api.get("/dashboard")
async def dashboard(user=Depends(get_current_user)):
    items = await db.requests.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    total = len(items)
    helped = total + 20
    matched = total * 3

    by_need: Dict[str, int] = {}
    by_urgency: Dict[str, int] = {}
    by_location: Dict[str, int] = {}
    for it in items:
        by_need[it["category"]] = by_need.get(it["category"], 0) + 1
        by_urgency[it["urgency"]] = by_urgency.get(it["urgency"], 0) + 1
        by_location[it["location"]] = by_location.get(it["location"], 0) + 1

    high = [i for i in items if i["urgency"] == "HIGH"][:5]
    recent = items[:5]

    return {
        "metrics": {"requests": total, "helped": helped, "matches": matched},
        "by_need": by_need,
        "by_urgency": by_urgency,
        "by_location": by_location,
        "high_priority": high,
        "recent": recent,
    }

# CHAT
@api.post("/chat", response_model=ChatOut)
async def chat(body: ChatIn, user=Depends(get_current_user)):
    session_id = body.session_id or f"chat-{user['id']}"
    text = body.message.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message required")

    emergency = is_emergency(text)
    category, _, _ = analyze_need(text)

    if emergency:
        response = (
            "I hear you and I'm here with you. Your life matters.\n\n"
            "Please reach out right now:\n"
            "• Emergency: 112\n"
            "• Mental Health Helpline (iCall India): 9152987821\n"
            "• Vandrevala Foundation: 1860-2662-345\n\n"
            "You are not alone. Stay on the line with someone who can help."
        )
    else:
        try:
            system = (
                "You are CareConnect AI, a warm, empathetic helper that connects people to support "
                "(food, medical, financial, mental health, education). Be supportive, human, concise. "
                "Acknowledge feelings, suggest concrete next steps, and gently guide users to seek the right help. "
                "Never give medical or legal directives — encourage contacting professionals when relevant."
            )
            chat_obj = make_chat(session_id, system)
            prompt = f"User need category: {category}\nUser message: {text}\n\nRespond in 4-6 short sentences."
            response = await chat_obj.send_message(UserMessage(text=prompt))
        except Exception as e:
            logger.warning(f"LLM chat failed: {e}")
            response = (
                f"I understand. It sounds like you may need {category.lower()}. "
                "You are not alone — try the Find Help page to discover nearby support."
            )

    # store
    await db.chat_messages.insert_many([
        {"id": str(uuid.uuid4()), "user_id": user["id"], "session_id": session_id, "role": "user",
         "content": text, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "user_id": user["id"], "session_id": session_id, "role": "assistant",
         "content": response, "created_at": datetime.now(timezone.utc).isoformat()},
    ])

    return ChatOut(response=response, session_id=session_id, is_emergency=emergency, category=category)

@api.get("/chat/history")
async def chat_history(session_id: Optional[str] = None, user=Depends(get_current_user)):
    q: Dict[str, Any] = {"user_id": user["id"]}
    if session_id:
        q["session_id"] = session_id
    items = await db.chat_messages.find(q, {"_id": 0}).sort("created_at", 1).to_list(500)
    return items

# FIND HELP
@api.post("/find-help", response_model=FindHelpOut)
async def find_help(body: FindHelpIn, user=Depends(get_current_user)):
    category, urgency, urgency_score = analyze_need(body.need)
    count = max(3, min(body.count or 6, 12))

    # Save the request implicitly so dashboard tracks it
    await db.requests.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "raw_need": body.need,
        "category": category,
        "urgency": urgency,
        "urgency_score": urgency_score,
        "location": body.location,
        "phone": "",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    system = (
        "You are CareConnect AI's resource finder. Output ONLY a JSON array — no prose, no markdown. "
        "Each item: {name, location, description, contact, reason}. "
        "Names must sound realistic, contacts must look like phone numbers or websites, "
        "descriptions 1-2 sentences, reason explains why this org fits the user's need."
    )
    prompt = (
        f"User need: {body.need}\n"
        f"Detected category: {category}\n"
        f"Urgency: {urgency}\n"
        f"Location: {body.location}\n\n"
        f"Generate {count} unique helpful organizations as a JSON array."
    )

    raw = ""
    parsed = None
    try:
        chat_obj = make_chat(f"findhelp-{user['id']}-{uuid.uuid4()}", system)
        raw = await chat_obj.send_message(UserMessage(text=prompt))
        parsed = extract_json_array(raw)
    except Exception as e:
        logger.warning(f"LLM find-help failed: {e}")

    if not parsed:
        # Sensible fallback
        parsed = [
            {"name": f"{category} Center #{i+1}",
             "location": body.location,
             "description": f"Local organization providing {category.lower()} for community members in need.",
             "contact": "+91-1800-000-000",
             "reason": f"Closest match to your {category.lower()} need."}
            for i in range(count)
        ]

    img = CATEGORY_IMAGES.get(category, CATEGORY_IMAGES["General Help"])
    orgs: List[Organization] = []
    import random as _rand
    for idx, it in enumerate(parsed[:count]):
        match_score = _rand.randint(72, 96)
        priority = min(100, match_score + (urgency_score // 4))
        name = str(it.get("name", f"Care Org {idx+1}"))
        loc = str(it.get("location", body.location))
        maps = f"https://www.google.com/maps/search/{name.replace(' ', '+')}+{loc.replace(' ', '+')}"
        orgs.append(Organization(
            name=name,
            location=loc,
            description=str(it.get("description", "")),
            contact=str(it.get("contact", "")),
            reason=str(it.get("reason", "")),
            match_score=match_score,
            priority_score=priority,
            image=img,
            maps_link=maps,
        ))

    return FindHelpOut(category=category, urgency=urgency, urgency_score=urgency_score, organizations=orgs)

# SETTINGS
@api.get("/settings", response_model=SettingsModel)
async def get_settings(user=Depends(get_current_user)):
    s = user.get("settings") or {}
    return SettingsModel(**{**SettingsModel().model_dump(), **s})

@api.put("/settings", response_model=SettingsModel)
async def put_settings(body: SettingsModel, user=Depends(get_current_user)):
    await db.users.update_one({"id": user["id"]}, {"$set": {"settings": body.model_dump()}})
    return body

app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    mongo.close()
