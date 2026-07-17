
import React, { useState } from 'react';
import Flashcard from './Flashcard';
import { createFlashcard } from "../lib/api";

export default function CardCreator({ documentId, onCardCreated, onClose }) {
  const [newCard, setNewCard] = useState({ 
    question: "Type a study question...", 
    answer: "Type the clear answer context..." 
  });
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (field, value) => {
    setNewCard(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!newCard.question.trim() || !newCard.answer.trim()) {
      alert("Fields cannot be empty!");
      return;
    }
    try {
      setSaving(true);
      const created = await createFlashcard(documentId, newCard.question, newCard.answer);
      onCardCreated(created);
      onClose();
    } catch (err) {
      alert("Could not process new entry registry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="nes-container with-title is-rounded bg-white p-6 max-w-2xl mx-auto my-4">
      <p className="title text-sm">Forge Custom Flashcard</p>
      
      <div className="mb-4">
        <Flashcard 
          question={newCard.question}
          answer={newCard.answer}
          isFlipped={false}
          isEditing={true}
          onUpdateField={handleFieldChange}
        />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button className="nes-btn" onClick={onClose} disabled={saving}>
          Cancel
        </button>
        <button className="nes-btn is-success" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Card'}
        </button>
      </div>
    </div>
  );
}