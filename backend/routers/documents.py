import io
import os

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pypdf import PdfReader

from db import supabase
from services.chunking import chunk_text
from services.embeddings import embed_text
from services.audio import transcribe_audio, parse_timestamped_transcript
from services.documents_service import get_owned_document
from services.auth import get_current_user


AUDIO_MIME_MAP = {
    ".mp3": "audio/mp3",
    ".wav": "audio/wav",
    ".aac": "audio/aac",
    ".m4a": "audio/aac",  # iPhone Voice Memos exports .m4a — it's AAC audio, Gemini just wants the audio/aac label
    ".ogg": "audio/ogg",
    ".flac": "audio/flac",
    ".aiff": "audio/aiff",
    ".aif": "audio/aiff",
}

def resolve_audio_mime_type(filename: str, fallback: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    return AUDIO_MIME_MAP.get(ext, fallback or "audio/mp3")

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    contents = await file.read()
    pdf = PdfReader(io.BytesIO(contents))

    extracted_text = ""
    for page in pdf.pages:
        extracted_text += page.extract_text() or ""

    chunks = chunk_text(extracted_text)

    # user_id links this document to whoever is logged in - this is
    # what makes "list my documents" and "only I can chat with mine"
    # actually work.
    doc_response = (
        supabase.table("documents")
        .insert(
            {
                "title": file.filename,
                "source_type": "pdf",
                "user_id": current_user.id,
            }
        )
        .execute()
    )
    document_id = doc_response.data[0]["id"]

    chunk_rows = []
    for index, chunk in enumerate(chunks):
        embedding = embed_text(chunk)
        chunk_rows.append(
            {
                "document_id": document_id,
                "content": chunk,
                "embedding": embedding,
                "chunk_index": index,
            }
        )

    if chunk_rows:
        supabase.table("chunks").insert(chunk_rows).execute()

    return {
        "document_id": document_id,
        "filename": file.filename,
        "num_pages": len(pdf.pages),
        "num_chunks": len(chunks),
    }


@router.post("/upload-audio")
async def upload_audio_document(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    """
    Upload a lecture recording. Gemini transcribes it directly (no
    separate speech-to-text service), and the timestamped transcript is
    chunked + embedded exactly like a PDF - so chat and notes work on
    audio documents with no extra code.

    Note: Gemini's free tier accepts inline audio up to ~20MB. Bigger
    lecture recordings would need Google's separate Files API, which
    isn't wired up here yet.
    """
    contents = await file.read()
    mime_type = resolve_audio_mime_type(file.filename, file.content_type)

    transcript_raw = transcribe_audio(contents, mime_type)
    segments = parse_timestamped_transcript(transcript_raw)

    doc_response = (
        supabase.table("documents")
        .insert(
            {
                "title": file.filename,
                "source_type": "audio",
                "user_id": current_user.id,
            }
        )
        .execute()
    )
    document_id = doc_response.data[0]["id"]

    chunk_rows = []
    for index, (timestamp, text) in enumerate(segments):
        embedding = embed_text(text)
        chunk_rows.append(
            {
                "document_id": document_id,
                "content": text,
                "embedding": embedding,
                "chunk_index": index,
                "page_or_timestamp": timestamp,
            }
        )

    if chunk_rows:
        supabase.table("chunks").insert(chunk_rows).execute()

    return {
        "document_id": document_id,
        "filename": file.filename,
        "num_segments": len(segments),
    }


@router.get("")
async def list_documents(current_user=Depends(get_current_user)):
    response = (
        supabase.table("documents")
        .select("id, title, source_type, created_at")
        .eq("user_id", current_user.id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data


@router.delete("/{document_id}")
async def delete_document(document_id: str, current_user=Depends(get_current_user)):
    get_owned_document(document_id, current_user.id)  # 404/403 if not yours

    response = supabase.table("documents").delete().eq("id", document_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Document not found.")
    return {"message": "Document successfully deleted", "document_id": document_id}
