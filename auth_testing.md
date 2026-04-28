# CareConnect AI - Auth Testing Playbook

## Hybrid auth model
- **Email/password**: bcrypt + JWT (existing) — endpoints `/api/auth/signup`, `/api/auth/login`
- **Google social login**: Emergent-managed Google Auth → exchanges `session_id` server-side via `/api/auth/google-session` → returns the SAME JWT shape as login

## Test accounts
- Email/password: `test@example.com` / `Pass1234!`
- Google: any Google account that completes the Emergent OAuth flow

## Manual verify (curl)
```bash
API=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)

# Email login
curl -s -X POST "$API/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass1234!"}'

# /api/auth/me (Bearer)
TOKEN=...
curl -s "$API/api/auth/me" -H "Authorization: Bearer $TOKEN"
```

## Google flow (manual)
1. Open `/login` → click "Continue with Google"
2. Redirected to `https://auth.emergentagent.com/?redirect=<origin>/`
3. After Google consent, returns to `<origin>/#session_id=<sid>`
4. Frontend `AuthCallback` calls `POST /api/auth/google-session` with `{ session_id }`
5. Backend exchanges `session_id` → finds/creates user → returns `{ token, user }`
6. Frontend stores JWT in `localStorage.cc_token` and routes to `/`

## Common issues
- ❌ Hardcoded redirect URL → use `window.location.origin` only
- ❌ Wrong CORS → backend allows `*` already
- ❌ Token expired → re-login (7-day expiry)
