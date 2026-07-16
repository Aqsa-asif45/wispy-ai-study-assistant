from fastapi import APIRouter
from pydantic import BaseModel
from db import supabase
from services.embeddings import embed_text
from services.gemini_client import generate_answer

router = APIRouter(prefix="/chat", tags=["chat"])

# Pydantic model = defines the shape of the incoming JSON request body.
# FastAPI automatically validates incoming requests against this.
class ChatRequest(BaseModel):
    document_id: str
    question: str

@router.post("/")
def ask_question(request: ChatRequest):
    # Step 1: embed the question the same way we embedded the chunks
    question_embedding = embed_text(request.question)

    # Step 2: ask Postgres for the most similar chunks (our new SQL function)
    result = supabase.rpc("match_chunks", {
        "query_embedding": question_embedding,
        "match_document_id": request.document_id,
        "match_count": 5
    }).execute()

    matched_chunks = result.data
    context_texts = [chunk["content"] for chunk in matched_chunks]

    # Step 3: generate the answer, grounded in those chunks
    answer = generate_answer(request.question, context_texts)

    return {
        "answer": answer,
        "sources": matched_chunks
    }