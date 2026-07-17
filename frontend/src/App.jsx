
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudyAssistant from "./pages/StudyAssistant";
import AuthPage from "./pages/Auth/AuthPage"; // 🆕 Import the new Auth page

// Simple route guard to prevent unauthenticated access
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // No token found? Send them to the login terminal
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route 1: Default to Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        
        {/* Route 2: Authentication Terminal */}
        <Route path="/login" element={<AuthPage />} />
        
        {/* Route 3: Protected Study Workspace */}
        <Route 
          path="/workspace" 
          element={
            <ProtectedRoute>
              <StudyAssistant />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback Catch-all Route */}
        <Route path="*" replace element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
