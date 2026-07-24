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
  }, [onUploadSuccess]); // Refreshes the list automatically if a new upload completes

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevents selecting the document while trying to delete it
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
      className={`nes-container with-title is-dark h-full flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Title row + collapse toggle. When collapsed, hide the title text
          (no room for it) but keep the toggle button visible so you can
          expand again. */}
      <div className="flex items-center justify-between mb-2">
        {!collapsed && <p className="title text-xs">File Library</p>}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-white text-xs px-2 py-1 border border-gray-500 hover:border-white ml-auto"
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          !collapsed && <p className="text-xs text-gray-400 animate-pulse">Loading directory...</p>
        ) : documents.length === 0 ? (
          !collapsed && <p className="text-xs text-gray-500 italic">No files in library.</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDoc(doc.id)}
              title={doc.title} // shows the full name on hover, useful when collapsed
              className={`p-2 border-2 text-xs flex items-center cursor-pointer transition-colors ${
                collapsed ? "justify-center" : "justify-between"
              } ${
                selectedDocId === doc.id
                  ? 'border-purple-400 bg-purple-900 text-white'
                  : 'border-gray-600 hover:border-white'
              }`}
            >
              {collapsed ? (
                <span>💾</span>
              ) : (
                <>
                  <span className="truncate mr-2">💾 {doc.title}</span>
                  <button
                    onClick={(e) => handleDelete(e, doc.id)}
                    className="text-red-400 hover:text-red-600 font-bold px-1"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}