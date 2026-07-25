import React, { useEffect, useState } from 'react';
import { getDocuments, deleteDocument } from "../lib/api";

export default function Sidebar({ selectedDocId, onSelectDoc, onUploadSuccess }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Error fetching library directory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [onUploadSuccess]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Trash this document and all its chunks?")) return;
    try {
      await deleteDocument(id);
      fetchDocs();
      if (selectedDocId === id) onSelectDoc(null);
    } catch (err) {
      alert("Failed to delete document.");
    }
  };

  return (
    <div
      className={`nes-container with-title is-rounded h-full flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden relative pt-4 ${
        collapsed ? "w-16" : "w-60"
      }`}
      style={{
        backgroundColor: "var(--color-night-card)",
        borderColor: "var(--color-night-border)",
        color: "var(--color-night-text)",
      }}
    >
      {!collapsed && (
        <p
          className="title text-xs font-bold px-2 py-0.5 rounded"
          style={{
            backgroundColor: "var(--color-night-panel)",
            color: "var(--color-night-text)",
            marginTop: "-0.5rem"
          }}
        >
          File Library 📚
        </p>
      )}

      <button
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`absolute top-2 z-10 text-xs w-6 h-6 flex items-center justify-center border transition-colors ${
          collapsed ? "left-1/2 -translate-x-1/2" : "right-2"
        }`}
        style={{
          borderColor: "var(--color-night-border)",
          color: "var(--color-night-text)",
          backgroundColor: "var(--color-night-panel)",
        }}
      >
        {collapsed ? "▶" : "◀"}
      </button>

      <div className={`flex-1 overflow-y-auto space-y-3 ${collapsed ? "mt-8" : "mt-4"}`}>
        {loading ? (
          !collapsed && <p className="text-xs opacity-60 animate-pulse px-1">Loading directory...</p>
        ) : documents.length === 0 ? (
          !collapsed && (
            <p className="text-xs opacity-60 italic px-1">
              Nothing here yet — upload something to wake me up 🐾
            </p>
          )
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDoc(doc.id)}
              title={doc.title}
              className={`group px-3 py-2 border text-xs flex items-center cursor-pointer rounded-sm transition-all ${
                collapsed ? "justify-center" : "justify-between"
              }`}
              style={{
                borderColor: selectedDocId === doc.id ? "var(--color-night-accent)" : "var(--color-night-border)",
                backgroundColor: selectedDocId === doc.id ? "rgba(167,139,250,0.18)" : "rgba(255,255,255,0.03)",
              }}
            >
              {collapsed ? (
                <span className="text-base">{doc.source_type === "audio" ? "🎙️" : "📄"}</span>
              ) : (
                <>
                  <span className="flex items-center gap-2 truncate mr-2">
                    <span>{doc.source_type === "audio" ? "🎙️" : "📄"}</span>
                    <span className="truncate">{doc.title}</span>
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, doc.id)}
                    className="text-red-400 hover:text-red-500 font-bold px-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {!collapsed && documents.length > 0 && (
        <p className="text-[10px] opacity-50 mt-2 text-center font-silkscreen">
          {documents.length} document{documents.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}