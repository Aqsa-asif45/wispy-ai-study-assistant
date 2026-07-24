import json
from typing import List

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from db import supabase
from services.documents_service import get_document_content, get_owned_document
from services.gemini_client import client as genai_client
from services.auth import get_current_user

router = APIRouter(prefix="/notes", tags=["notes"])


# These Pydantic models describe the exact JSON shape we want back from
# Gemini. Passing this as `response_schema` forces the model to return
# valid, matching JSON instead of us having to hope it does.
class GlossaryItem(BaseModel):
    term: str
    definition: str


class SectionItem(BaseModel):
    heading: str
    bullets: List[str]


class NotesResponseSchema(BaseModel):
    tldr: str
    key_concepts: List[str]
    glossary: List[GlossaryItem]
    sections: List[SectionItem]


@router.post("/{document_id}/generate")
async def generate_notes(document_id: str, current_user=Depends(get_current_user)):
    get_owned_document(document_id, current_user.id)  # 404/403 if not yours

    document_text = get_document_content(document_id)
    if not document_text:
        raise HTTPException(
            status_code=404,
            detail="Could not retrieve content for this document. Make sure it has been processed and chunked.",
        )

    prompt = f"""
    You are Wispy, a cute and extremely helpful retro-style AI study assistant.
    Read the study text below and produce structured notes: a short tl;dr,
    a list of key concepts, a glossary of important terms with plain-English
    definitions, and a few sections each with a heading and bullet points.

    Study Document Text:
    {document_text}
    """

    try:
        response = genai_client.models.generate_content(
            model="gemini-flash-lite-latest",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": NotesResponseSchema,
            },
        )
        notes_json = json.loads(response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notes generation failed: {str(e)}")

    # Replace any previous notes for this document with the fresh set,
    # so re-generating doesn't leave stale duplicates behind.
    supabase.table("notes").delete().eq("document_id", document_id).execute()
    insert_response = (
        supabase.table("notes")
        .insert({"document_id": document_id, "content": notes_json})
        .execute()
    )

    return insert_response.data[0]


@router.get("/{document_id}")
async def fetch_notes(document_id: str, current_user=Depends(get_current_user)):
    get_owned_document(document_id, current_user.id)

    result = (
        supabase.table("notes")
        .select("*")
        .eq("document_id", document_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="No notes generated yet for this document.")
    return result.data[0]
