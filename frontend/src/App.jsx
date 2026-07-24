import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudyAssistant from "./pages/StudyAssistant";
import FlashcardsPage from "./pages/Flashcards";
import AuthPage from "./pages/Auth/AuthPage";
import { ThemeProvider } from "./context/ThemeContext";
import Cutscene from "./pages/Cutscene";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/cutscene" element={<Cutscene />} />
          <Route path="/login" element={<AuthPage />} />

          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <StudyAssistant />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspace/:docId/flashcards"
            element={
              <ProtectedRoute>
                <FlashcardsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" replace element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;