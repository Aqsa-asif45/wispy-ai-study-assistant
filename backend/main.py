import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import supabase, SUPABASE_URL
from routers import documents, chat, auth, flashcards, notes

from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Wispy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(chat.router)
app.include_router(flashcards.router)
app.include_router(notes.router)


@app.get("/")
def read_root():
    return {"message": "Wispy backend is running 🐾"}


@app.get("/test-db")
def test_db():
    try:
        response = supabase.auth.get_session()
        return {"status": "connected", "supabase_url": SUPABASE_URL}
    except Exception as e:
        return {"status": "error", "detail": str(e)}