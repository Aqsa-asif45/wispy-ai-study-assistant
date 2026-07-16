from fastapi import APIRouter, UploadFile, File
from pypdf import PdfReader
import io
from services.chunking import chunk_text

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # Read the uploaded file's raw bytes into memory
    contents = await file.read()

    # PdfReader needs a file-like object, not raw bytes directly -
    # io.BytesIO wraps our bytes so PdfReader can read it like a file
    pdf = PdfReader(io.BytesIO(contents))

    # Pull text out of every page and join it into one big string
    extracted_text = ""
    for page in pdf.pages:
        extracted_text += page.extract_text() or ""

    chunks = chunk_text(extracted_text)

    return {
        "filename": file.filename,
        "num_pages": len(pdf.pages),
        "num_chunks": len(chunks),
        "first_chunk_preview": chunks[0][:300] if chunks else None
    }