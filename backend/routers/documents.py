from fastapi import APIRouter, UploadFile, File
from pypdf import PdfReader
import io
from services.chunking import chunk_text
from services.embeddings import embed_text
from db import supabase

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    contents = await file.read()
    pdf = PdfReader(io.BytesIO(contents))

    extracted_text = ""
    for page in pdf.pages:
        extracted_text += page.extract_text() or ""

    chunks = chunk_text(extracted_text)

    # Step 1: create the parent "documents" row first.
    # .execute() sends the request to Supabase and waits for the response.
    # user_id is left out for now - we'll wire that in once login/signup exists.
    doc_response = supabase.table("documents").insert({
        "title": file.filename,
        "source_type": "pdf"
    }).execute()

    document_id = doc_response.data[0]["id"]

    # Step 2: embed and insert every chunk, linked to that document
    chunk_rows = []
    for index, chunk in enumerate(chunks):
        embedding = embed_text(chunk)
        chunk_rows.append({
            "document_id": document_id,
            "content": chunk,
            "embedding": embedding,
            "chunk_index": index
        })

    supabase.table("chunks").insert(chunk_rows).execute()

    return {
        "document_id": document_id,
        "filename": file.filename,
        "num_pages": len(pdf.pages),
        "num_chunks": len(chunks)
    }