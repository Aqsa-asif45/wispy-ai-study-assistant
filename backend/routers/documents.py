from fastapi import APIRouter, UploadFile, File, HTTPException
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

# NEW: Fetch all stored documents from the library
@router.get("")
async def list_documents():
    try:
        response = supabase.table("documents").select("id", "title", "source_type", "created_at").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch documents: {str(e)}")

# NEW: Delete a document (and its chunks automatically via CASCADE)
@router.delete("/{document_id}")
async def delete_document(document_id: str):
    try:
        response = supabase.table("documents").delete().eq("id", document_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Document not found.")
        return {"message": "Document successfully deleted", "document_id": document_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete document: {str(e)}")