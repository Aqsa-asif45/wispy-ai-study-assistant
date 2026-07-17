import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import supabase, SUPABASE_URL
from routers import documents, chat, auth, flashcards 
from pydantic import BaseModel

# Import Google GenAI SDK
from google import genai
from google.genai import errors

# Force load the .env file first
from dotenv import load_dotenv
load_dotenv()

# This creates the actual web application object.
app = FastAPI(title="Wispy API")

# Initialize the Google GenAI client.
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("⚠️ WARNING: GEMINI_API_KEY was not found in environment variables!")

genai_client = genai.Client(api_key=api_key)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # our Vite frontend's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect all modular endpoints 
app.include_router(auth.router)       
app.include_router(documents.router)
app.include_router(chat.router)
app.include_router(flashcards.router)  # 🚀 Fully activated!

# Pydantic schema for incoming study requests
class DocumentRequest(BaseModel):
    document_id: str


# Helper function to fetch and stitch extracted text chunks from Supabase
def get_document_content(document_id: str) -> str:
    """
    Retrieves and stitches together all text chunks associated with a document ID,
    guaranteeing correct chronological reading order via 'chunk_index'.
    """
    try:
        print(f"🔍 Fetching text chunks for Document ID: {document_id}...")
        
        # Query the 'chunks' table, ordering by chunk_index to preserve flow
        response = supabase.table("chunks") \
            .select("content") \
            .eq("document_id", document_id) \
            .order("chunk_index", desc=False) \
            .execute()
        
        if response.data and len(response.data) > 0:
            # Extract content from each chunk dictionary and join them
            chunks = [row.get("content", "") for row in response.data]
            full_text = "\n\n".join(chunks).strip()
            
            print(f"✅ Successfully stitched together {len(chunks)} chunks ({len(full_text)} characters).")
            return full_text
        else:
            print(f"⚠️ No chunks found in database for document ID: {document_id}")
            
    except Exception as e:
        print(f"💥 Critical Database error while retrieving chunks: {str(e)}")
        
    return ""


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


# Dynamic LLM-Powered Notes Endpoint using Gemini
@app.post("/notes")
async def generate_notes(request: DocumentRequest):
    document_text = get_document_content(request.document_id)
    
    if not document_text:
        raise HTTPException(
            status_code=404, 
            detail="Could not retrieve content for this document. Make sure it has been processed and chunked."
        )

    prompt = f"""
    You are Wispy, a cute and extremely helpful retro-style AI study assistant. 
    Summarize the provided study text into highly structured, comprehensive, and clear notes. 
    Use Markdown headers, bullet points, and bold text to make it easy to read. 
    Add a friendly, retro-enthusiastic mascot sign-off at the very end!

    Study Document Text:
    {document_text}
    """

    try:
        response = genai_client.models.generate_content(
             model="gemini-flash-lite-latest",
            contents=prompt
        )
        return {"notes": response.text}
        
    except errors.ClientError as e:
        error_msg = str(e)
        print(f"💥 Gemini ClientError inside /notes: {error_msg}")
        
        # Safely handle potential API rate-limit errors (HTTP 429)
        if "429" in error_msg or (hasattr(e, "code") and e.code == 429):
            raise HTTPException(
                status_code=429, 
                detail="Wispy is a bit overloaded right now (rate limit hit). Try again in a minute!"
            )
        raise HTTPException(status_code=400, detail=f"Gemini API error: {error_msg}")
        
    except Exception as e:
        print(f"💥 Unexpected Server Error in /notes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"LLM Notes Generation failed: {str(e)}")