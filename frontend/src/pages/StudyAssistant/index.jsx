import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WispyMascot from "../../components/WispyMascot";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import {
  uploadDocument,
  uploadAndTranscribeAudio,
  askQuestion,
  generateNotes,
  getNotes,
} from "../../lib/api";

export default function StudyAssistant() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isNight = theme === "night";

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);
  const [docId, setDocId] = useState(null);
  const [docName, setDocName] = useState("");
  const [uploadTrigger, setUploadTrigger] = useState(0);

  const [activeTab, setActiveTab] = useState("chat");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [notes, setNotes] = useState(null);
  const [generatingNotes, setGeneratingNotes] = useState(false);

  const [chatState, setChatState] = useState("idle");

  useEffect(() => {
    if (!docId) {
      setNotes(null);
      setMessages([]);
      return;
    }

    const loadExistingNotes = async () => {
      try {
        const existing = await getNotes(docId);
        setNotes(existing.content);
      } catch (err) {
        setNotes(null);
      }
    };

    loadExistingNotes();
  }, [docId]);

  const handleSelectDocument = (selectedId) => {
    setDocId(selectedId);
    if (!selectedId) {
      setDocName("");
    } else {
      setDocName(`Library Reference ID: ${selectedId.substring(0, 8)}...`);
    }
    setMessages([]);
  };

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
      setUploadTrigger((prev) => prev + 1);
      setTimeout(() => setChatState("idle"), 3000);
    } catch (err) {
      alert("Upload failed. Make sure your FastAPI backend is running!");
      setChatState("idle");
    } finally {
      setUploading(false);
    }
  };

  const handleAudioSelect = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setAudioUploading(true);
    setChatState("thinking");
    try {
      const data = await uploadAndTranscribeAudio(selected);
      setDocId(data.document_id);
      setDocName(selected.name);
      setChatState("happy");
      setUploadTrigger((prev) => prev + 1);
      setTimeout(() => setChatState("idle"), 3000);
    } catch (err) {
      alert("Audio upload failed. Make sure your FastAPI backend is running!");
      setChatState("idle");
    } finally {
      setAudioUploading(false);
      e.target.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
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
        { sender: "wispy", text: "Uh oh, I ran into an error processing that. Try asking again!" },
      ]);
      setChatState("idle");
    }
  };

  const handleGenerateNotes = async () => {
    if (!docId) return;

    setGeneratingNotes(true);
    setChatState("thinking");
    try {
      const data = await generateNotes(docId);
      setNotes(data.content);
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

  const handleOpenFlashcards = () => {
    if (!docId) return;
    navigate(`/workspace/${docId}/flashcards`);
  };

  const panelBg = isNight ? "bg-night-panel border border-night-border" : "bg-white";
  const headingColor = isNight ? "text-night-accent" : "text-titlebar-purple";

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${isNight ? "bg-night-bg" : "bg-blush-pink"}`}>
      <Navbar />

      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 max-w-[1440px] w-full mx-auto">

        <div>
          <Sidebar
            selectedDocId={docId}
            onSelectDoc={handleSelectDocument}
            onUploadSuccess={uploadTrigger}
          />
        </div>

        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          <div className={`nes-container is-rounded p-4 shadow ${panelBg}`}>
            <h2 className={`text-lg font-silkscreen mb-4 ${headingColor}`}>Study Source 📚</h2>

            {!docId ? (
              <div className="flex flex-col gap-4">
                <form onSubmit={handleUpload} className="flex flex-col gap-4">
                  <label className="nes-btn is-normal w-full text-center cursor-pointer">
                    <span>📄 Select PDF</span>
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

                <div className="text-center text-[10px] text-gray-400 font-silkscreen">— or —</div>

                <label className="nes-btn is-normal w-full text-center cursor-pointer">
                  <span>🎙️ {audioUploading ? "Transcribing..." : "Upload Audio Lecture"}</span>
                  <input
                    type="file"
                    accept=".m4a,.mp3,.wav,.aac,.ogg,.flac,audio/*"
                    onChange={handleAudioSelect}
                    disabled={audioUploading}
                    className="hidden"
                  />
                </label>
                {audioUploading && (
                  <p className="text-xs text-center text-ink-brown animate-pulse">
                    Listening carefully. No skimming...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-sm flex flex-col gap-3">
                <div>
                  <p className="text-green-600 font-bold mb-1">✓ Active Source Block</p>
                  <p className={`text-xs p-2 rounded truncate border ${isNight ? "text-night-text bg-night-card border-night-border" : "text-ink-brown bg-gray-50 border-gray-200"}`}>
                    {docName}
                  </p>
                </div>

                <button
                  onClick={handleGenerateNotes}
                  disabled={generatingNotes}
                  className="nes-btn is-warning text-xs w-full"
                >
                  {generatingNotes ? "Generating Notes..." : "✨ Generate Notes"}
                </button>

                <button onClick={handleOpenFlashcards} className="nes-btn is-success text-xs w-full">
                  🃏 Flashcards
                </button>

                <button
                  onClick={() => {
                    setDocId(null);
                    setFile(null);
                    setMessages([]);
                    setNotes(null);
                    setActiveTab("chat");
                  }}
                  className="nes-btn is-error text-xs w-full"
                >
                  Clear Context
                </button>
              </div>
            )}
          </div>

          <div className={`nes-container is-rounded p-4 flex flex-col items-center justify-center min-h-[240px] shadow ${panelBg}`}>
            <WispyMascot state={chatState} size="md" theme={theme} />
          </div>
        </div>

        <div className={`flex-1 nes-container is-rounded p-4 flex flex-col h-[80vh] shadow ${panelBg}`}>

          <div className={`flex border-b pb-3 mb-4 gap-4 items-center justify-between flex-wrap ${isNight ? "border-night-border" : "border-gray-200"}`}>
            <h2 className={`text-sm md:text-lg font-silkscreen ${headingColor}`}>
              {activeTab === "chat" && "Wispy Assistant Chat 💬"}
              {activeTab === "notes" && "Generated Study Notes 📝"}
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
            </div>
          </div>

          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin">
                {messages.length === 0 ? (
                  <div className={`h-full flex flex-col items-center justify-center text-sm font-silkscreen text-center p-4 ${isNight ? "text-night-text/50" : "text-gray-400"}`}>
                    <p className="mb-2">🐾</p>
                    <p>
                      {!docId
                        ? "Select or upload a library document to start!"
                        : "Ask me anything or switch tabs to build study blocks!"}
                    </p>
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
                  placeholder={docId ? "Ask Wispy a question..." : "Select a file to wake Wispy up..."}
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

          {activeTab === "notes" && (
            <div className={`flex-1 overflow-y-auto p-4 rounded border text-sm ${isNight ? "bg-night-card border-night-border text-night-text" : "bg-gray-50 border-gray-200 text-gray-800"}`}>
              {!notes ? (
                <p>No notes generated yet. Click 'Generate Notes' from the actions bar!</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-bold mb-1 ${headingColor}`}>TL;DR</h3>
                    <p>{notes.tldr}</p>
                  </div>
                  <div>
                    <h3 className={`font-bold mb-1 ${headingColor}`}>Key Concepts</h3>
                    <ul className="list-disc list-inside">
                      {notes.key_concepts.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className={`font-bold mb-1 ${headingColor}`}>Glossary</h3>
                    <ul className="list-disc list-inside">
                      {notes.glossary.map((g, i) => (
                        <li key={i}>
                          <strong>{g.term}:</strong> {g.definition}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {notes.sections.map((s, i) => (
                    <div key={i}>
                      <h3 className={`font-bold mb-1 ${headingColor}`}>{s.heading}</h3>
                      <ul className="list-disc list-inside">
                        {s.bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}