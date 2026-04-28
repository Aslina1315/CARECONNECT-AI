# CareConnect AI - PRD

## Original problem statement
User had a Streamlit single-file CareConnect AI app and asked for a clean, beautiful, elegant, eye-catchy, comforting React frontend with all the same workflows preserved.

## Architecture
- Backend: FastAPI + MongoDB + emergentintegrations LLM (Gemini 3 Flash)
- Frontend: React + Tailwind + Framer Motion + Lucide React + shadcn (sonner)
- Auth: JWT + bcrypt

## User personas
- People in need of food, medical, financial, mental-health, education, or emergency aid
- Care coordinators tracking requests via the dashboard

## Core requirements (static)
- Login/Signup
- Home: About + Request Help form
- Chat Assistant (multi-turn AI with emergency detection)
- Find Help (AI-generated org cards + auto-detect location)
- Dashboard (metrics, charts, high-priority alerts, recent activity)
- Profile (editable)
- Settings (toggles)

## Implemented
- Full FastAPI backend (auth, requests, chat, find-help, dashboard, settings, profile)
- All 7 React pages with Outfit/DM Sans, sage + terracotta palette, Framer Motion animations, animated logo, glass navbar, blob background
- Tested end-to-end (auth -> request -> chat -> find-help -> dashboard)

## Backlog (P1/P2)
- P1: Real Google social login integration
- P1: Push notifications when matches arrive
- P2: Org verification and ratings
- P2: Volunteer-side dashboard
