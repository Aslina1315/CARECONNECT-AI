"""CareConnect AI backend tests - auth, requests, chat, find-help, dashboard, settings."""
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://care-compass-107.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

UNIQUE_EMAIL = f"test+{int(time.time())}{uuid.uuid4().hex[:6]}@example.com"
PASSWORD = "Pass1234!"
NAME = "TEST User"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def auth(session):
    # signup new user
    r = session.post(f"{API}/auth/signup", json={"name": NAME, "email": UNIQUE_EMAIL, "password": PASSWORD}, timeout=30)
    assert r.status_code == 200, f"signup failed: {r.status_code} {r.text}"
    data = r.json()
    assert data["user"]["email"] == UNIQUE_EMAIL
    assert isinstance(data["token"], str) and len(data["token"]) > 10
    return data


# --- Auth ---
def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200

def test_signup_duplicate(session, auth):
    r = session.post(f"{API}/auth/signup", json={"name": NAME, "email": UNIQUE_EMAIL, "password": PASSWORD})
    assert r.status_code == 400

def test_login_success(session, auth):
    r = session.post(f"{API}/auth/login", json={"email": UNIQUE_EMAIL, "password": PASSWORD})
    assert r.status_code == 200
    assert r.json()["user"]["email"] == UNIQUE_EMAIL

def test_login_invalid(session):
    r = session.post(f"{API}/auth/login", json={"email": UNIQUE_EMAIL, "password": "wrong"})
    assert r.status_code == 401

def test_me(session, auth):
    r = session.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {auth['token']}"})
    assert r.status_code == 200
    assert r.json()["email"] == UNIQUE_EMAIL

def test_me_unauthorized(session):
    r = session.get(f"{API}/auth/me")
    assert r.status_code == 401

def test_update_profile(session, auth):
    h = {"Authorization": f"Bearer {auth['token']}"}
    r = session.put(f"{API}/auth/profile", json={"phone": "+91-9999000011", "location": "Mumbai"}, headers=h)
    assert r.status_code == 200
    body = r.json()
    assert body["phone"] == "+91-9999000011"
    assert body["location"] == "Mumbai"
    # GET to verify persistence
    r2 = session.get(f"{API}/auth/me", headers=h)
    assert r2.json()["location"] == "Mumbai"


# --- Requests ---
def test_create_request_and_list(session, auth):
    h = {"Authorization": f"Bearer {auth['token']}"}
    r = session.post(f"{API}/requests", json={"need": "I urgently need food, I'm hungry", "location": "Mumbai", "phone": "+911234567890"}, headers=h)
    assert r.status_code == 200
    body = r.json()
    assert body["category"] == "Food Support"
    assert body["urgency"] == "HIGH"
    assert body["location"] == "Mumbai"
    rid = body["id"]
    # list
    r2 = session.get(f"{API}/requests", headers=h)
    assert r2.status_code == 200
    items = r2.json()
    assert any(i["id"] == rid for i in items)


# --- Chat ---
def test_chat_emergency(session, auth):
    h = {"Authorization": f"Bearer {auth['token']}"}
    r = session.post(f"{API}/chat", json={"message": "I want to commit suicide"}, headers=h, timeout=60)
    assert r.status_code == 200
    body = r.json()
    assert body["is_emergency"] is True
    assert "112" in body["response"] or "helpline" in body["response"].lower()

def test_chat_normal(session, auth):
    h = {"Authorization": f"Bearer {auth['token']}"}
    r = session.post(f"{API}/chat", json={"message": "I'm feeling stressed about money"}, headers=h, timeout=60)
    assert r.status_code == 200
    body = r.json()
    assert body["is_emergency"] is False
    assert isinstance(body["response"], str) and len(body["response"]) > 5

def test_chat_history(session, auth):
    h = {"Authorization": f"Bearer {auth['token']}"}
    r = session.get(f"{API}/chat/history", headers=h)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    assert len(items) >= 2

def test_chat_empty(session, auth):
    h = {"Authorization": f"Bearer {auth['token']}"}
    r = session.post(f"{API}/chat", json={"message": "   "}, headers=h)
    assert r.status_code == 400


# --- Find Help ---
def test_find_help(session, auth):
    h = {"Authorization": f"Bearer {auth['token']}"}
    r = session.post(f"{API}/find-help", json={"need": "Need medical help for fever", "location": "Delhi", "count": 4}, headers=h, timeout=90)
    assert r.status_code == 200
    body = r.json()
    assert body["category"] == "Medical Support"
    assert isinstance(body["organizations"], list)
    assert len(body["organizations"]) >= 3
    org = body["organizations"][0]
    for k in ("name", "location", "description", "contact", "reason", "match_score", "priority_score", "image", "maps_link"):
        assert k in org


# --- Dashboard ---
def test_dashboard(session, auth):
    h = {"Authorization": f"Bearer {auth['token']}"}
    r = session.get(f"{API}/dashboard", headers=h)
    assert r.status_code == 200
    body = r.json()
    assert "metrics" in body and "requests" in body["metrics"]
    assert body["metrics"]["requests"] >= 1
    assert "by_need" in body and "by_urgency" in body and "by_location" in body
    assert isinstance(body["high_priority"], list)
    assert isinstance(body["recent"], list)


# --- Settings ---
def test_settings_get_default(session, auth):
    h = {"Authorization": f"Bearer {auth['token']}"}
    r = session.get(f"{API}/settings", headers=h)
    assert r.status_code == 200
    body = r.json()
    assert set(body.keys()) >= {"notifications", "dark_mode", "save_activity"}

def test_settings_update_persist(session, auth):
    h = {"Authorization": f"Bearer {auth['token']}"}
    payload = {"notifications": False, "dark_mode": True, "save_activity": False}
    r = session.put(f"{API}/settings", json=payload, headers=h)
    assert r.status_code == 200
    assert r.json() == payload
    # GET to verify persistence
    r2 = session.get(f"{API}/settings", headers=h)
    assert r2.json() == payload
