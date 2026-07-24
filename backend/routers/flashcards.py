import json
from typing import List

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from db import supabase
from services.documents_service import get_document_content, get_owned_document
from services.gemini_client import client as genai_client
from services.auth import get_current_user

router = APIRouter(prefix="/flashcards", tags=["flashcards"])


class FlashcardItem(BaseModel):
    question: str = Field(description="The front side question of the study card.")
    answer: str = Field(description="The reverse side answer.")


class FlashcardResponseSchema(BaseModel):
    flashcards: List[FlashcardItem]


@router.post("/{document_id}/generate")
async def generate_flashcards(document_id: str, current_user=Depends(get_current_user)):
    get_owned_document(document_id, current_user.id)  # 404/403 if not yours

    document_text = get_document_content(document_id)
    if not document_text:
        raise HTTPException(status_code=404, detail="Document content empty.")

    prompt = f"""
    You are Wispy, a retro-style study assistant. Analyze this study text and extract
    the core academic terms, concepts, or formulas into an array of interactive study flashcards.
    Make the questions concise and the answers clear and high-yield!

    Study Text:
    {document_text}
    """

    try:
        response = genai_client.models.generate_content(
            model="gemini-flash-lite-latest",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": FlashcardResponseSchema,
            },
        )
        cards = json.loads(response.text)["flashcards"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Flashcard generation failed: {str(e)}")

    # Replace old flashcards for this document with the fresh set.
    supabase.table("flashcards").delete().eq("document_id", document_id).execute()
    rows = [
        {"document_id": document_id, "question": c["question"], "answer": c["answer"]}
        for c in cards
    ]
    if rows:
        supabase.table("flashcards").insert(rows).execute()

    return {"flashcards": cards}


@router.get("/{document_id}")
async def fetch_flashcards(document_id: str, current_user=Depends(get_current_user)):
    get_owned_document(document_id, current_user.id)

    result = (
        supabase.table("flashcards")
        .select("*")
        .eq("document_id", document_id)
        .order("created_at")
        .execute()
    )
    return result.data

class CreateFlashcardRequest(BaseModel):
    question: str
    answer: str

@router.post("/{document_id}")
async def create_flashcard(
    document_id: str,
    payload: CreateFlashcardRequest,
    current_user=Depends(get_current_user),
):
    get_owned_document(document_id, current_user.id)
    result = (
        supabase.table("flashcards")
        .insert({"document_id": document_id, "question": payload.question, "answer": payload.answer})
        .execute()
    )
    return result.data[0]