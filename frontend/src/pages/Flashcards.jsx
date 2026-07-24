import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import Navbar from "../components/Navbar";
import WispyMascot from "../components/WispyMascot";
import Flashcard from "../components/Flashcard";
import CardCreator from "../components/CardCreator";
import { useTheme } from "../context/ThemeContext";
import { getFlashcards, generateFlashcards } from "../lib/api";

export default function FlashcardsPage() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isNight = theme === "night";

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [queue, setQueue] = useState([]);
  const [masteredIds, setMasteredIds] = useState(new Set());
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCreatingCustomCard, setIsCreatingCustomCard] = useState(false);

  const confettiFired = useRef(false);

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await getFlashcards(docId);
      const list = data || [];
      setCards(list);
      setQueue(list.map((_, i) => i));
      setMasteredIds(new Set());
      confettiFired.current = false;
    } catch (err) {
      setCards([]);
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (docId) loadCards();
  }, [docId]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await generateFlashcards(docId);
      const list = data.flashcards || [];
      setCards(list);
      setQueue(list.map((_, i) => i));
      setMasteredIds(new Set());
      confettiFired.current = false;
    } catch (err) {
      alert("Failed to generate flashcards. Check your backend endpoint /flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCustomCardCreated = (newCard) => {
    setCards((prev) => {
      const updated = [...prev, newCard];
      setQueue((q) => [...q, updated.length - 1]);
      return updated;
    });
  };

  const currentIndex = queue[0];
  const currentCard = currentIndex !== undefined ? cards[currentIndex] : null;

  const markGotIt = () => {
    if (currentIndex === undefined) return;
    setMasteredIds((prev) => new Set(prev).add(currentIndex));
    setQueue((prev) => prev.slice(1));
    setIsFlipped(false);
  };

  const markReviewAgain = () => {
    if (currentIndex === undefined) return;
    setQueue((prev) => [...prev.slice(1), currentIndex]);
    setIsFlipped(false);
  };

  const progressPercent = cards.length > 0 ? Math.round((masteredIds.size / cards.length) * 100) : 0;
  const isDeckComplete = cards.length > 0 && queue.length === 0;

  useEffect(() => {
    if (isDeckComplete && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isDeckComplete]);

  const panelBg = isNight ? "bg-night-panel border border-night-border" : "bg-white";
  const headingColor = isNight ? "text-night-accent" : "text-titlebar-purple";

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${isNight ? "bg-night-bg" : "bg-blush-pink"}`}>
      <Navbar />

      <div className="flex-1 p-6 flex flex-col items-center gap-6">

        <div className="w-full max-w-2xl flex items-center justify-between">
          <button onClick={() => navigate("/workspace")} className="nes-btn text-xs">
            &lt; Back to Workspace
          </button>
          <h1 className={`font-silkscreen text-lg ${headingColor}`}>Flashcards 🃏</h1>
          <div className="w-24" />
        </div>

        {cards.length > 0 && (
          <div className="w-full max-w-2xl">
            <progress
              className="nes-progress is-success w-full"
              value={masteredIds.size}
              max={cards.length}
            />
            <p className={`text-xs text-center font-silkscreen mt-1 ${isNight ? "text-night-text" : "text-ink-brown"}`}>
              {masteredIds.size} / {cards.length} mastered ({progressPercent}%)
            </p>
          </div>
        )}

        <div className={`nes-container is-rounded p-6 w-full max-w-2xl flex-1 flex flex-col items-center justify-center min-h-[400px] ${panelBg}`}>

          {loading ? (
            <p className={`text-sm font-silkscreen animate-pulse ${isNight ? "text-night-text/60" : "text-gray-400"}`}>
              Loading your deck...
            </p>
          ) : isCreatingCustomCard ? (
            <div className="w-full">
              <CardCreator
                documentId={docId}
                onCardCreated={(card) => {
                  handleCustomCardCreated(card);
                  setIsCreatingCustomCard(false);
                }}
                onClose={() => setIsCreatingCustomCard(false)}
              />
            </div>
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <WispyMascot state="idle" size="lg" theme={theme} />
              <p className={`text-sm font-silkscreen ${isNight ? "text-night-text/70" : "text-gray-500"}`}>
                No flashcards yet for this document.
              </p>
              <button onClick={handleGenerate} disabled={generating} className="nes-btn is-primary text-xs">
                {generating ? "Turning notes into tiny quizzes..." : "✨ Generate Flashcards"}
              </button>
            </div>
          ) : isDeckComplete ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <WispyMascot state="happy" size="lg" theme={theme} />
              <p className={`font-pixel text-sm ${headingColor}`}>Tiny progress detected! 🎉</p>
              <p className={`text-sm ${isNight ? "text-night-text" : "text-gray-600"}`}>
                You've mastered all {cards.length} cards in this deck.
              </p>
              <div className="flex gap-3">
                <button onClick={loadCards} className="nes-btn text-xs">Review Again</button>
                <button onClick={() => navigate("/workspace")} className="nes-btn is-primary text-xs">
                  Back to Workspace
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full flex justify-between items-center mb-4">
                <span className={`text-xs font-silkscreen ${isNight ? "text-night-text" : "text-ink-brown"}`}>
                  {queue.length} card{queue.length !== 1 ? "s" : ""} left this round
                </span>
                <button
                  className="nes-btn is-primary text-[10px]"
                  onClick={() => setIsCreatingCustomCard(true)}
                >
                  ＋ Add Card
                </button>
              </div>

              <Flashcard
                key={currentIndex}
                question={currentCard.question}
                answer={currentCard.answer}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
              />

              <div className="flex gap-4 mt-6">
                <button onClick={markReviewAgain} className="nes-btn is-error text-xs">
                  Review Again
                </button>
                <button onClick={markGotIt} className="nes-btn is-success text-xs">
                  Got It ✓
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}