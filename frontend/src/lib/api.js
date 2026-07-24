const API_BASE_URL = "http://localhost:8000";

/**
 * Reads the JWT saved at login and turns it into an Authorization
 * header. Every protected backend route needs this now - without it
 * every request gets a 401.
 */
function authHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Matches backend: POST /documents/upload
 */
export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Matches backend: POST /documents/upload-audio
 */
export async function uploadAndTranscribeAudio(audioFile) {
  const formData = new FormData();
  formData.append("file", audioFile);

  const response = await fetch(`${API_BASE_URL}/documents/upload-audio`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Audio processing failed with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Matches backend: GET /documents
 */
export async function getDocuments() {
  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to retrieve file library with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Matches backend: DELETE /documents/{document_id}
 */
export async function deleteDocument(documentId) {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to drop document with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Matches backend: POST /chat/{document_id}
 */
export async function askQuestion(documentId, question) {
  const response = await fetch(`${API_BASE_URL}/chat/${documentId}`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(`Query failed with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Matches backend: GET /chat/{document_id}
 */
export async function getChatHistory(documentId) {
  const response = await fetch(`${API_BASE_URL}/chat/${documentId}`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to load chat history with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Matches backend: POST /notes/{document_id}/generate
 */
export async function generateNotes(documentId) {
  const response = await fetch(`${API_BASE_URL}/notes/${documentId}/generate`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Notes generation failed");
  return response.json();
}

/**
 * Matches backend: GET /notes/{document_id}
 */
export async function getNotes(documentId) {
  const response = await fetch(`${API_BASE_URL}/notes/${documentId}`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to load notes");
  return response.json();
}

/**
 * Matches backend: POST /flashcards/{document_id}/generate
 */
export async function generateFlashcards(documentId) {
  const response = await fetch(`${API_BASE_URL}/flashcards/${documentId}/generate`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Flashcards generation failed");
  return response.json();
}

/**
 * Matches backend: GET /flashcards/{document_id}
 */
export async function getFlashcards(documentId) {
  const response = await fetch(`${API_BASE_URL}/flashcards/${documentId}`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to download cards with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Matches backend: POST /flashcards/{document_id} (manual single card,
 * separate from /generate which makes a whole AI deck)
 */
export async function createFlashcard(documentId, question, answer) {
  const response = await fetch(`${API_BASE_URL}/flashcards/${documentId}`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ question, answer }),
  });
  if (!response.ok) {
    throw new Error(`Failed to build custom flashcard with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Registers a new user account with email and password
 */
export async function signUpUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to forge new profile.");
  }
  return response.json();
}

/**
 * Authenticates an existing user and returns their JWT access token
 */
export async function signInUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Invalid credentials provided.");
  }
  return response.json();
}