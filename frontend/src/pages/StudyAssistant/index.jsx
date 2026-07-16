import React, { useState } from "react";
import WispyMascot from "../../components/WispyMascot";
import Flashcard from "../../components/Flashcard";
import { uploadDocument, askQuestion, generateNotes, generateFlashcards } from "../../lib/api";

export default function StudyAssistant() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [docId, setDocId] = useState(null);
  const [docName, setDocName] = useState("");
  
  // Navigation tabs: "chat", "notes", or "flashcards"
  const [activeTab, setActiveTab] = useState("chat");
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
  // Notes state
  const [notes, setNotes] = useState("");
  const [generatingNotes, setGeneratingNotes] = useState(false);

  // Flashcards state
  const [flashcards, setFlashcards] = useState([]);
  const [generatingCards, setGeneratingCards] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false); // <-- FIX 1: Track if the current card is flipped

  const [chatState, setChatState] = useState("idle"); // idle, thinking, happy

  // Handle PDF Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setChatState("thinking");
    try {
      const data = await uploadDocument(file);
      setDocId(data.document_id);
      setDocName(file.name);
      setChatState("happy");
      setTimeout(() => setChatState("idle"), 3000);
    } catch (err) {
      alert("Upload failed. Make sure your FastAPI backend is running!");
      setChatState("idle");
    } finally {
      setUploading(false);
    }
  };

  // Send Message to backend RAG chat
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !docId) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setChatState("thinking");

    try {
      const data = await askQuestion(docId, input);
      setMessages((prev) => [...prev, { sender: "wispy", text: data.answer }]);
      setChatState("happy");
      setTimeout(() => setChatState("idle"), 2500);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "wispy", text: "Uh oh, I ran into an error processing that. Try asking again!" }
      ]);
      setChatState("idle");
    }
  };

  // Generate Notes
  const handleGenerateNotes = async () => {
    if (!docId) return;

    setGeneratingNotes(true);
    setChatState("thinking");
    try {
      const data = await generateNotes(docId);
      setNotes(data.notes);
      setActiveTab("notes");
      setChatState("happy");
      setTimeout(() => setChatState("idle"), 2500);
    } catch (err) {
      alert("Failed to generate notes. Check your backend endpoint /notes.");
      setChatState("idle");
    } finally {
      setGeneratingNotes(false);
    }
  };

  // Generate Flashcards
  const handleGenerateCards = async () => {
    if (!docId) return;

    setGeneratingCards(true);
    setChatState("thinking");
    try {
      const data = await generateFlashcards(docId);
      // Backend should return JSON containing cards array: { "flashcards": [{ "question": "...", "answer": "..." }] }
      setFlashcards(data.flashcards || []);
      setCurrentCardIndex(0);
      setIsCardFlipped(false); // <-- FIX 2: Reset card orientation on generation
      setActiveTab("flashcards");
      setChatState("happy");
      setTimeout(() => setChatState("idle"), 2500);
    } catch (err) {
      alert("Failed to generate flashcards. Check your backend endpoint /flashcards.");
      setChatState("idle");
    } finally {
      setGeneratingCards(false);
    }
  };

  // Card Navigation
  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsCardFlipped(false); // <-- FIX 3: Reset card orientation when going to next
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setIsCardFlipped(false); // <-- FIX 4: Reset card orientation when going to prev
    }
  };

  return (
    <div className="min-h-screen bg-blush-pink p-6 flex flex-col md:flex-row gap-6 font-sans">
      
      {/* Left Sidebar: Document Upload & Wispy Status */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        
        {/* PDF Upload Container */}
        <div className="nes-container is-rounded bg-white p-4 shadow">
          <h2 className="text-lg font-silkscreen text-titlebar-purple mb-4">Study Source 📚</h2>
          
          {!docId ? (
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <label className="nes-btn is-normal w-full text-center cursor-pointer">
                <span>Select PDF</span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setFile(e.target.files[0])} 
                  className="hidden" 
                />
              </label>
              {file && (
                <p className="text-xs text-ink-brown bg-gray-100 p-2 rounded truncate border border-dashed border-gray-300">
                  Selected: {file.name}
                </p>
              )}
              
              <button 
                type="submit" 
                disabled={!file || uploading} 
                className={`nes-btn w-full ${file ? "is-primary" : "is-disabled"}`}
              >
                {uploading ? "Uploading..." : "Upload to Wispy"}
              </button>
            </form>
          ) : (
            <div className="text-sm flex flex-col gap-3">
              <div>
                <p className="text-green-600 font-bold mb-1">✓ Document Loaded!</p>
                <p className="text-xs text-ink-brown bg-gray-50 p-2 rounded truncate border border-gray-200">
                  {docName}
                </p>
              </div>

              {/* Notes Action */}
              <button 
                onClick={handleGenerateNotes} 
                disabled={generatingNotes || generatingCards}
                className="nes-btn is-warning text-xs w-full"
              >
                {generatingNotes ? "Generating Notes..." : "✨ Generate Notes"}
              </button>

              {/* Flashcards Action */}
              <button 
                onClick={handleGenerateCards} 
                disabled={generatingCards || generatingNotes}
                className="nes-btn is-success text-xs w-full"
              >
                {generatingCards ? "Generating Cards..." : "🃏 Generate Cards"}
              </button>

              <button 
                onClick={() => { 
                  setDocId(null); 
                  setFile(null); 
                  setMessages([]); 
                  setNotes(""); 
                  setFlashcards([]);
                  setActiveTab("chat");
                }} 
                className="nes-btn is-error text-xs w-full"
              >
                Clear Document
              </button>
            </div>
          )}
        </div>

        {/* Wispy Interactive Mascot Block */}
        <div className="nes-container is-rounded bg-white p-4 flex flex-col items-center justify-center min-h-[240px] shadow">
          <WispyMascot state={chatState} size="md" />
        </div>
      </div>

      {/* Right Column: Tabbed View (Chat / Notes / Flashcards) */}
      <div className="flex-1 nes-container is-rounded bg-white p-4 flex flex-col h-[80vh] shadow">
        
        {/* Workspace Header Tabs */}
        <div className="flex border-b border-gray-200 pb-3 mb-4 gap-4 items-center justify-between">
          <h2 className="text-lg font-silkscreen text-titlebar-purple">
            {activeTab === "chat" && "Wispy Assistant Chat 💬"}
            {activeTab === "notes" && "Generated Study Notes 📝"}
            {activeTab === "flashcards" && "Interactive Flashcards 🃏"}
          </h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab("chat")} 
              className={`nes-btn text-xs ${activeTab === "chat" ? "is-primary" : ""}`}
            >
              Chat
            </button>
            <button 
              onClick={() => setActiveTab("notes")} 
              disabled={!notes}
              className={`nes-btn text-xs ${activeTab === "notes" ? "is-primary" : ""} ${!notes ? "is-disabled" : ""}`}
            >
              Notes
            </button>
            <button 
              onClick={() => setActiveTab("flashcards")} 
              disabled={flashcards.length === 0}
              className={`nes-btn text-xs ${activeTab === "flashcards" ? "is-primary" : ""} ${flashcards.length === 0 ? "is-disabled" : ""}`}
            >
              Cards
            </button>
          </div>
        </div>

        {/* Tab 1: Chat Interface */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm font-silkscreen text-center p-4">
                  <p className="mb-2">🐾</p>
                  <p>{!docId ? "Upload a document to wake Wispy up!" : "Ask me anything or click 'Generate Cards'!"}</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg max-w-[85%] ${
                      msg.sender === "user" 
                        ? "bg-purple-100 text-purple-900 self-end rounded-br-none shadow-sm" 
                        : "bg-gray-100 text-gray-900 self-start rounded-bl-none border-l-4 border-titlebar-purple shadow-sm"
                    }`}
                  >
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {msg.sender === "user" ? "You" : "Wispy"}
                    </p>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!docId || chatState === "thinking"}
                placeholder={docId ? "Ask Wispy a question..." : "Waiting for document upload..."} 
                className="nes-input flex-1 bg-gray-50 text-sm"
              />
              <button 
                type="submit" 
                disabled={!docId || !input.trim() || chatState === "thinking"} 
                className={`nes-btn ${docId && input.trim() && chatState !== "thinking" ? "is-success" : "is-disabled"}`}
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Notes Interface */}
        {activeTab === "notes" && (
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded border border-gray-200">
            <div className="prose max-w-none text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-sans">
              {notes || "No notes generated yet. Click 'Generate Notes' from the left sidebar!"}
            </div>
          </div>
        )}

        {/* Tab 3: Flashcards Interface */}
        {activeTab === "flashcards" && flashcards.length > 0 && (
          <div className="flex-1 flex flex-col justify-between items-center p-4">
            
            <div className="text-xs font-silkscreen text-ink-brown mb-2">
              Card {currentCardIndex + 1} of {flashcards.length}
            </div>

            {/* Interactive Card */}
            <div className="w-full flex justify-center items-center flex-1">
              {/* FIX 5: We pass the isCardFlipped state and toggle trigger function down to the card */}
              <Flashcard 
                key={currentCardIndex} 
                question={flashcards[currentCardIndex].question} 
                answer={flashcards[currentCardIndex].answer} 
                isFlipped={isCardFlipped}
                onFlip={() => setIsCardFlipped(!isCardFlipped)}
              />
            </div>

            {/* Card Navigation Footer */}
            <div className="flex gap-4 w-full justify-center mt-4">
              <button 
                onClick={prevCard} 
                disabled={currentCardIndex === 0}
                className={`nes-btn text-xs ${currentCardIndex === 0 ? "is-disabled" : ""}`}
              >
                &lt; Prev
              </button>
              <button 
                onClick={nextCard} 
                disabled={currentCardIndex === flashcards.length - 1}
                className={`nes-btn text-xs ${currentCardIndex === flashcards.length - 1 ? "is-disabled" : ""}`}
              >
                Next &gt;
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}