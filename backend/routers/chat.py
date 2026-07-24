from fastapi import APIRouter, Depends
from pydantic import BaseModel

from db import supabase
from services.embeddings import embed_text
from services.gemini_client import generate_answer
from services.documents_service import get_owned_document
from services.auth import get_current_user

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    question: str


@router.post("/{document_id}")
def ask_question(
    document_id: str,
    request: ChatRequest,
    current_user=Depends(get_current_user),
):
    get_owned_document(document_id, current_user.id)  # 404/403 if not yours

    # Step 1: embed the question the same way we embedded the chunks
    question_embedding = embed_text(request.question)

    # Step 2: ask Postgres for the most similar chunks
    result = supabase.rpc(
        "match_chunks",
        {
            "query_embedding": question_embedding,
            "match_document_id": document_id,
            "match_count": 5,
        },
    ).execute()

    matched_chunks = result.data
    context_texts = [chunk["content"] for chunk in matched_chunks]

    # Step 3: generate the answer, grounded in those chunks
    answer = generate_answer(request.question, context_texts)

    cited_ids = [chunk["id"] for chunk in matched_chunks if "id" in chunk]

    # Step 4: save both messages so the conversation survives a refresh
    supabase.table("chat_messages").insert(
        [
            {"document_id": document_id, "role": "user", "content": request.question},
            {
                "document_id": document_id,
                "role": "assistant",
                "content": answer,
                "cited_chunks": cited_ids,
            },
        ]
    ).execute()

    return {"answer": answer, "sources": matched_chunks}


@router.get("/{document_id}")
def get_chat_history(document_id: str, current_user=Depends(get_current_user)):
    get_owned_document(document_id, current_user.id)

    result = (
        supabase.table("chat_messages")
        .select("*")
        .eq("document_id", document_id)
        .order("created_at")
        .execute()
    )
    return result.data
