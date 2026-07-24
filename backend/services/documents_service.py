from fastapi import HTTPException

from db import supabase


def get_document_content(document_id: str) -> str:
    """
    Retrieves and stitches together all text chunks belonging to a
    document, in reading order (via chunk_index), so notes/flashcards
    prompts get the full original text back as one string.
    """
    response = (
        supabase.table("chunks")
        .select("content")
        .eq("document_id", document_id)
        .order("chunk_index", desc=False)
        .execute()
    )

    if not response.data:
        return ""

    chunks = [row.get("content", "") for row in response.data]
    return "\n\n".join(chunks).strip()


def get_owned_document(document_id: str, user_id: str) -> dict:
    """
    Fetches a document row and checks it actually belongs to the given
    user. Raises 404 if it doesn't exist at all, 403 if it exists but
    belongs to someone else.

    Call this at the top of any endpoint that touches one specific
    document (chat, notes, flashcards, delete) - it's what stops one
    user from reading or generating content for another user's files.
    """
    response = supabase.table("documents").select("*").eq("id", document_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Document not found.")

    document = response.data[0]
    if document.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="You don't have access to this document.")

    return document
