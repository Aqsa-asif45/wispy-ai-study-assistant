from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

router = APIRouter(tags=["Flashcards"])

# Define structural layout schemas for the LLM output engine
class FlashcardItem(BaseModel):
    question: str = Field(description="The front side definition or question of the study card.")
    answer: str = Field(description="The reverse side explanation or shorthand answer.")

class FlashcardResponseSchema(BaseModel):
    flashcards: List[FlashcardItem]

class FlashcardRequest(BaseModel):
    document_id: str

@router.post("/flashcards")
async def generate_flashcards(request: FlashcardRequest):
    # 🌟 LOCAL IMPORTS: This breaks the circular loop completely during startup!
    from main import genai_client, get_document_content 
    
    # Reuse your stitching helper function
    document_text = get_document_content(request.document_id)
    
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
        # Use Structured Outputs to guarantee proper JSON array formats
        response = genai_client.models.generate_content(
            model="gemini-flash-lite-latest",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": FlashcardResponseSchema,
            }
        )
        
        import json
        structured_json = json.loads(response.text)
        return structured_json

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Flashcard production failure: {str(e)}")