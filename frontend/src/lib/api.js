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

/**
 * Sends a raw audio recording to the backend for multimodal processing
 * Matches backend: POST /audio/transcribe
 */
export async function uploadAndTranscribeAudio(audioFile) {
  const formData = new FormData();
  formData.append("file", audioFile);

  const response = await fetch(`${API_BASE_URL}/audio/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Audio processing failed with status: ${response.status}`);
  }

  return response.json();
}

/* ==========================================
   🆕 PHASE 1 NEW ADDITIONS
   ========================================== */

/**
 * Fetches all available documents in the user's library directory
 * Matches backend: GET /documents
 */
export async function getDocuments() {
  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`Failed to retrieve file library with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Wipes a specific document and cascades through its metadata chunks
 * Matches backend: DELETE /documents/{document_id}
 */
export async function deleteDocument(documentId) {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to drop document with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Retrieves existing flashcards belonging to a specific document ID
 * Matches backend: GET /flashcards?document_id=...
 */
export async function getFlashcards(documentId) {
  const response = await fetch(`${API_BASE_URL}/flashcards?document_id=${documentId}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`Failed to download cards with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Submits a completely manual custom study card row to the registry
 * Matches backend: POST /flashcards (for manual creation)
 */
export async function createFlashcard(documentId, question, answer) {
  const response = await fetch(`${API_BASE_URL}/flashcards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document_id: documentId,
      question: question,
      answer: answer,
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to build custom flashcard with status: ${response.status}`);
  }
  return response.json();
}

// Add these to your existing named exports in src/lib/api.js

/**
 * Registers a new user account with email and password
 */
export async function signUpUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to forge new profile.");
  }

  return response.json(); // Usually returns user object or confirmation status
}

/**
 * Authenticates an existing user and returns their JWT access token
 */
export async function signInUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Invalid credentials provided.");
  }

  return response.json(); // Expected to return { access_token: "...", token_type: "bearer" }
}