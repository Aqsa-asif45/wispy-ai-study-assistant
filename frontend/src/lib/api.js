const API_BASE_URL = "http://localhost:8000";

/**
 * Matches your actual backend: POST /documents/upload
 */
export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status: ${response.status}`);
  }

  return response.json();
}

/**
 * Matches your actual backend: POST /chat/
 */
export async function askQuestion(documentId, question) {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document_id: documentId,
      question: question,
    }),
  });

  if (!response.ok) {
    throw new Error(`Query failed with status: ${response.status}`);
  }

  return response.json();
}

/**
 * Keep these ready for when you implement them on your backend!
 */
export async function generateNotes(documentId) {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId }),
  });
  if (!response.ok) throw new Error("Notes generation failed");
  return response.json();
}

export async function generateFlashcards(documentId) {
  const response = await fetch(`${API_BASE_URL}/flashcards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId }),
  });
  if (!response.ok) throw new Error("Flashcards generation failed");
  return response.json();
}