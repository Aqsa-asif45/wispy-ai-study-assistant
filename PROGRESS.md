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

- Full RAG ingest pipeline working: PDF upload → text extraction → chunking →
  local embeddings → stored in Supabase (documents + chunks tables)
- Backend uses Supabase secret key (bypasses RLS) since backend is trusted;
  RLS still protects data from direct frontend/browser access`

- Full RAG chat working: question → embed → pgvector similarity search → Gemini answer with citations
- Using gemini-flash-lite-latest (Google's alias system) instead of a
  version-pinned model name, since Gemini model names get deprecated
  periodically - the alias auto-points to their current stable free-tier model
- Basic rate-limit handling: 429 errors return a friendly message instead of crashing

## ✅ Backend completion pass (all MVP backend features)
- Centralized the Gemini client (one client in `services/gemini_client.py`,
  removed the duplicate in `db.py`/`main.py`); moved shared logic out of
  `main.py` into `services/documents_service.py`
- Real auth on every route: `services/auth.py` verifies the Supabase JWT
  from the `Authorization: Bearer <token>` header; `documents`, `chat`,
  `notes`, `flashcards` all require it and check document ownership
  (`get_owned_document`) before doing anything
- `documents.user_id` is now set on upload; `GET /documents` filters by
  the logged-in user
- Notes and flashcards are now persisted (`notes`/`flashcards` tables)
  and have `GET /notes/{document_id}` / `GET /flashcards/{document_id}`
  endpoints - they survive a refresh now
- Chat messages are saved to `chat_messages`; added
  `GET /chat/{document_id}` for history
- Audio Notes Taker built: `POST /documents/upload-audio` sends audio
  directly to Gemini for a timestamped transcript
  (`services/audio.py`), which is chunked/embedded the same as PDFs
  (`page_or_timestamp` populated) - notes/chat/flashcards work on audio
  documents with no extra code
- Added `supabase/schema.sql` - full table + `match_chunks()` function +
  RLS policy definitions, version-controlled instead of living only in
  the Supabase dashboard
- Updated `frontend/src/lib/api.js` to attach the auth token and match
  the corrected REST paths (`/notes/{id}/generate`,
  `/flashcards/{id}/generate`, `/documents/upload-audio`,
  `/chat/{id}`)

## 📝 Deviations from SRS (this pass)
- Chat/notes/flashcards endpoints use `{document_id}` as a path param
  (e.g. `POST /chat/{document_id}`) instead of a body field, matching
  SRS §6's own endpoint table more closely than the original
  implementation did
- Dropped the ad-hoc `createFlashcard` (manual card entry) frontend
  function - there's no backend endpoint for it and it wasn't in SRS
  scope; can be added later as a stretch goal if wanted