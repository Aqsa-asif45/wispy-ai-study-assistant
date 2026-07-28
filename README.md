# Wispy 🐾

A free AI study companion — turns your PDFs and lecture recordings into searchable notes, instant answers, and auto-generated flashcards.

Built with **React**, **Python (FastAPI)**, **Supabase (PostgreSQL + pgvector)**, and the **Google Gemini API**.

---

## 🌟 Features

- **📄 PDF & 🎙️ Audio Ingestion:** Upload lecture PDFs or audio recordings. Audio is processed natively via Gemini into timestamped transcripts.
- **🔍 Grounded RAG Chat:** Ask questions about your study materials and get answers grounded in your documents with precise source citations.
- **📝 AI Notes Generator:** Auto-generates structured summaries, key concepts, bullet points, and glossaries from your documents or audio.
- **🎴 Auto-Generated Flashcards:** Instantly convert document chunks or generated notes into interactive flashcards for fast review.
- **🎨 Pixel-Art Day/Night Mascot:** Features Wispy, a retro-styled mascot that transforms based on the time of day (including a late-night green witch hat form!).

---

## 🛠️ Architecture & Tech Stack

[ React + Vite + Tailwind + Framer Motion ] 
│
REST / JSON (JWT Auth)
▼
[ FastAPI Backend Service ]            
├── Document Ingest & Chunking
├── Local Embeddings (all-MiniLM-L6-v2)
└── RAG Pipeline & Gemini API Client
│
┌────────────┴────────────┐
▼                         ▼
[ Supabase Infrastructure ]  [ Google Gemini API ]
├── Auth (JWT Verification)  ├── Multimodal Audio
├── Storage (PDF/Audio)      └── Structured Generation
└── Postgres + pgvector


- **Frontend:** React, Vite, Tailwind CSS, nes.css, Framer Motion, canvas-confetti
- **Backend:** Python, FastAPI, Pydantic
- **Vector Search & Embeddings:** Local `sentence-transformers` (`all-MiniLM-L6-v2`) + PostgreSQL with `pgvector`
- **Database & Auth:** Supabase Auth, Supabase Storage, PostgreSQL
- **LLM Engine:** Google Gemini API (`gemini-flash-lite-latest`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Supabase Project & Gemini API Key

### Backend Setup
1. `cd backend`
2. `python -m venv venv && source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
3. `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and configure:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SECRET_KEY=your_supabase_secret_key
   GEMINI_API_KEY=your_gemini_api_key
Apply supabase/schema.sql inside your Supabase SQL Editor.

Run the dev server:

uvicorn app.main:app --reload

Frontend Setup
cd frontend
npm install

Copy .env.example to .env 

Run the frontend:
npm run dev

💡 What I Learned

RAG & Chunking Optimization: Tuning chunk size and token overlap directly impacts retrieval relevance and prevents LLM hallucinations.

pgvector in PostgreSQL: Using pgvector directly inside PostgreSQL eliminates the need for separate external vector database vendors.

Native Multimodal Workflows: Processing audio natively through Gemini drastically simplifies transcript-to-notes pipelines without requiring third-party STT tools.
