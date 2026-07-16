import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudyAssistant from "./pages/StudyAssistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page loads first when people hit your domain */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace" element={<StudyAssistant />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;