# Wispy — Build Progress Log

Tracks what's actually been built vs. the plan in `study-assistant-srs.md`.
Update this after each work session.

## ✅ Done
- Project scaffolded: git repo, GitHub remote, folder structure (frontend/backend)
- Backend: FastAPI running locally, connected to Supabase successfully (`/test-db` confirmed)
- Frontend: Vite + React + ESLint scaffolded
- Frontend styling: Tailwind CSS v4, nes.css, Framer Motion, canvas-confetti installed
- Custom color palette + Silkscreen pixel font wired up and confirmed rendering correctly
- Supabase project created (note: using new "publishable/secret" key system, not legacy anon/service_role)
- Gemini API key obtained

## 🚧 In progress / next up
- Build the actual Home / Landing page (SRS §10.1)
- Create Supabase database tables (SRS §5 — documents, chunks, notes, flashcards, chat_messages)

## 📝 Deviations from SRS
- Supabase key naming: SRS assumed `anon`/`service_role` keys; project uses newer
  `SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` naming (Supabase's current system as of mid-2026).
  Functionally equivalent, just a naming update.