
# Wispy — Build Progress Log

Tracks what's actually been built vs. the plan in `study-assistant-srs.md`.

## ✅ Done

### Scaffold & Configuration
- Project scaffolded: git repo, GitHub remote, folder structure (`frontend/` & `backend/`).
- Frontend setup: Vite + React, Tailwind CSS v4, `nes.css`, Framer Motion, `canvas-confetti`.
- Custom color palette, Silkscreen pixel font, and pixel window UI components wired up and confirmed.
- Supabase project initialized with updated key naming (`SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY`).
- Gemini API key integrated via Google AI Studio.

### Backend Infrastructure & Database
- FastAPI app running with CORS and unified response models.
- Database schema created in `supabase/schema.sql` (`documents`, `chunks`, `notes`, `flashcards`, `chat_messages` tables + `match_chunks()` pgvector RPC function + RLS policies).
- Centralized Gemini client (`services/gemini_client.py`) using `gemini-flash-lite-latest` alias for stable free-tier usage.
- Authentication module (`services/auth.py`) verifying Supabase JWTs on all secured routes.
- Basic 429 rate-limit fallback handling implemented.

### Core RAG Pipeline & Ingest
- PDF upload, text extraction, chunking, and local vector embedding (`sentence-transformers/all-MiniLM-L6-v2`) stored in Supabase `chunks` table.
- Grounded RAG Chat (`POST /chat/{document_id}`): question embedding → `pgvector` similarity search → Gemini generation with citations.
- Chat message history persisted to `chat_messages` with `GET /chat/{document_id}` endpoint.

### Audio & AI Notes / Flashcards Features
- Audio Notes Taker (`POST /documents/upload-audio`): Direct multimodal audio transmission to Gemini for timestamped transcripts (`services/audio.py`), chunked and stored identically to PDFs.
- AI Notes Generator (`POST /notes/{document_id}/generate` & `GET /notes/{document_id}`): Persisted structured note extractions (TL;DR, key concepts, glossary, bullet points).
- AI Flashcards Generator (`POST /flashcards/{document_id}/generate` & `GET /flashcards/{document_id}`): Auto-generated Q&A flashcards with DB persistence.

### Frontend Integration
- API client updated (`frontend/src/lib/api.js`) attaching Bearer tokens to match backend endpoints.
- Home / Landing page built introducing Wispy mascot and character lore.
- Integrated Study Assistant interface with Tab views for Chat, Notes, and Flashcards.

---

## 📝 Deviations from SRS

- **Supabase Key Naming:** Uses `SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` instead of legacy `anon`/`service_role` labels.
- **Path Parameters:** Endpoint routing uses `{document_id}` as explicit path params (e.g., `POST /chat/{document_id}`) to directly reflect REST standard guidelines in SRS §6[cite: 1].
- **Model Aliasing:** Bypassed strict model version-pinning in favor of `gemini-flash-lite-latest` to avoid deprecation breakage on Google's free tier.
- **Frontend Scope Cleanups:** Removed legacy standalone `createFlashcard` function from frontend API helper as flashcards are fully backend-generated.

---

## 🎉 Project Status: Complete