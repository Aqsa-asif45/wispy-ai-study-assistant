import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WispyMascot from "../components/WispyMascot";

// === Scene 1: The Wanderer — pixel forest at dawn ===
function ForestDawnBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #FFD9A0 0%, #FFB4C6 35%, #C9A8E0 70%, #6B5B95 100%)" }}
    >
      <div
        className="absolute rounded-full"
        style={{ width: "120px", height: "120px", left: "50%", top: "20%", transform: "translateX(-50%)", background: "radial-gradient(circle, #FFF3C4 0%, #FFD9A0 60%, transparent 100%)" }}
      />
      {[10, 25, 65, 82].map((leftPercent, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{ left: `${leftPercent}%`, width: 0, height: 0, borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderBottom: `${180 + i * 20}px solid #2A1B3D`, opacity: 0.6 + i * 0.1 }}
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-twinkle"
          style={{ width: "4px", height: "4px", left: `${10 + i * 11}%`, top: `${15 + (i % 3) * 20}%`, background: "#FFF3C4", animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </div>
  );
}

// === Scene 2: The Journey of Knowledge — dusk sky, floating books/symbols ===
function JourneyBackground() {
  const floaters = ["📖", "✦", "∑", "{ }", "📜", "✧", "📖", "∫"];
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #2E2154 0%, #4C3A7A 45%, #8B6FCE 100%)" }}
    >
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-twinkle"
          style={{ width: "3px", height: "3px", left: `${(i * 37) % 100}%`, top: `${(i * 23) % 60}%`, background: "#E9E4F5", animationDelay: `${(i % 5) * 0.4}s` }}
        />
      ))}
      {floaters.map((symbol, i) => (
        <div
          key={i}
          className="absolute text-2xl opacity-70"
          style={{
            left: `${8 + i * 11}%`,
            top: `${20 + (i % 4) * 15}%`,
            animation: `float-symbol ${4 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          {symbol}
        </div>
      ))}
      <style>{`
        @keyframes float-symbol {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </div>
  );
}

// === Scene 3: Becoming the Mentor — warm dusk, a glowing path stretching ahead ===
function MentorBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #6B5B95 0%, #E8B84B 45%, #F4A6C6 75%, #8B6FCE 100%)" }}
    >
      {[
        { left: "8%", h: 130, w: 90, color: "#3D2670", opacity: 0.55 },
        { left: "60%", h: 170, w: 110, color: "#2A1B52", opacity: 0.6 },
        { left: "78%", h: 110, w: 80, color: "#3D2670", opacity: 0.5 },
      ].map((m, i) => (
        <div
          key={i}
          className="absolute bottom-[38%]"
          style={{ left: m.left, width: 0, height: 0, borderLeft: `${m.w}px solid transparent`, borderRight: `${m.w}px solid transparent`, borderBottom: `${m.h}px solid ${m.color}`, opacity: m.opacity }}
        />
      ))}

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "70%",
          height: "42%",
          background: "linear-gradient(to top, rgba(255,243,196,0.55), rgba(255,243,196,0.05))",
          clipPath: "polygon(42% 0%, 58% 0%, 85% 100%, 15% 100%)",
        }}
      />

      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute text-sm animate-twinkle"
          style={{ left: `${20 + i * 6}%`, top: `${20 + (i % 4) * 12}%`, color: "#FFF3C4", animationDelay: `${i * 0.3}s` }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}

// === Scene 4: The Lair of Knowledge — a cozy pixel library ===
function LairBackground() {
  const bookColors = ["#8B6FCE", "#E8B84B", "#F4A6C6", "#4C3A7A", "#C9A8E0", "#6B5B95"];
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #14163A 0%, #241B42 100%)" }}
    >
      {["left-[3%]", "right-[3%]"].map((posClass, shelfIdx) => (
        <div key={shelfIdx} className={`absolute top-[8%] ${posClass} w-[20%] h-[75%] flex flex-col gap-3`}>
          {[...Array(4)].map((_, row) => (
            <div key={row} className="flex-1 flex gap-1 items-end border-b-4 border-[#4C3A7A] pb-1">
              {[...Array(6)].map((_, book) => (
                <div
                  key={book}
                  style={{
                    width: `${100 / 6}%`,
                    height: `${55 + ((row + book) % 3) * 15}%`,
                    background: bookColors[(row + book + shelfIdx) % bookColors.length],
                    border: "1px solid #14163A",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}

      <div
        className="absolute left-1/2 -translate-x-1/2 top-[10%]"
        style={{
          width: "220px",
          height: "260px",
          background: "linear-gradient(to bottom, #1A1333, #2E2154)",
          borderRadius: "110px 110px 8px 8px",
          border: "6px solid #4C3A7A",
          boxShadow: "0 0 30px rgba(196,181,253,0.25)",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{ width: "50px", height: "50px", left: "50%", top: "22%", transform: "translateX(-50%)", background: "radial-gradient(circle, #F5EFE0 0%, #E9E4F5 70%, transparent 100%)", boxShadow: "0 0 20px 6px rgba(245,239,224,0.4)" }}
        />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twinkle"
            style={{ width: "2px", height: "2px", left: `${15 + i * 13}%`, top: `${15 + (i % 3) * 15}%`, background: "#E9E4F5", animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>

      <div
        className="absolute rounded-full animate-pulse"
        style={{ width: "140px", height: "80px", left: "50%", bottom: "6%", transform: "translateX(-50%)", background: "radial-gradient(ellipse, rgba(232,184,75,0.5) 0%, transparent 75%)" }}
      />
    </div>
  );
}

// === Scene 5: Your Turn — a glowing wooden door in a stone frame ===
function DoorBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(circle at 50% 45%, #241B42 0%, #0F0B22 75%)" }}>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: "200px",
          height: "300px",
          transform: "translate(-50%, -50%)",
          background: "#3D2670",
          borderRadius: "90px 90px 6px 6px",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 animate-door-glow"
        style={{
          width: "168px",
          height: "268px",
          transform: "translate(-50%, calc(-50% + 6px))",
          background: "linear-gradient(to bottom, #A9744A, #6B4423)",
          borderRadius: "78px 78px 4px 4px",
        }}
      >
        <div className="absolute inset-4 border-2 border-[#5C3D1F] rounded-[60px_60px_4px_4px] opacity-60" />
        <div
          className="absolute rounded-full"
          style={{ width: "10px", height: "10px", right: "18px", top: "52%", background: "#E8B84B", boxShadow: "0 0 8px 2px rgba(232,184,75,0.7)" }}
        />
      </div>
      <div
        className="absolute rounded-full"
        style={{ width: "260px", height: "60px", left: "50%", top: "calc(50% + 145px)", transform: "translateX(-50%)", background: "radial-gradient(ellipse, rgba(232,184,75,0.45) 0%, transparent 75%)" }}
      />
      <style>{`
        @keyframes door-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.15); }
        }
        .animate-door-glow { animation: door-glow 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

const scenes = [
  {
    id: "wanderer",
    background: ForestDawnBackground,
    lines: [
      "A tiny kitten named Wispy wandered the world with nothing but endless curiosity. Every mountain, every village, every old library held another mystery waiting to be uncovered.",
      "But no matter how much Wispy explored, it always felt like there was more to learn.",
    ],
  },
  {
    id: "journey",
    background: JourneyBackground,
    lines: [
      "Instead of chasing treasures... Wispy chased knowledge.",
      "He studied ancient scrolls, solved impossible puzzles, learned from masters, experimented, failed, tried again... Every lesson made him wiser, every mistake made him stronger.",
    ],
  },
  {
    id: "mentor",
    background: MentorBackground,
    lines: [
      "Years passed. The curious kitten became a master learner.",
      "Not because he knew everything — but because he never stopped asking questions. Soon, travelers from everywhere sought Wispy's guidance. He became the study companion everyone wished they had.",
    ],
  },
  {
    id: "lair",
    background: LairBackground,
    lines: [
      "Today... Wispy lives in the legendary Lair of Knowledge.",
      "A place filled with books, ideas, experiments, and endless quests. The entrance doesn't open with strength... it opens to those who are curious enough to learn.",
    ],
  },
  {
    id: "yourturn",
    background: DoorBackground,
    lines: [
      '"Another traveler?"',
      '"Knowledge isn\'t reserved for the smartest. Only for those willing to keep learning."',
      "The door slowly opens... Will you begin your journey?",
    ],
  },
];

const SOUND_STORAGE_KEY = "wispy-cutscene-sound";

export default function Cutscene() {
  const navigate = useNavigate();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem(SOUND_STORAGE_KEY);
    return saved === null ? true : saved === "true";
  });

  const audioCtxRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
  }, [soundEnabled]);

  const playBlip = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = 520;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.08);
    } catch (err) {
      // Sound is a nice-to-have — fail silently if the browser blocks it.
    }
  };

  const scene = scenes[sceneIndex];
  const currentLine = scene.lines[lineIndex];
  const BackgroundComponent = scene.background;

  const isLastLineOfCutscene =
    sceneIndex === scenes.length - 1 && lineIndex === scene.lines.length - 1;

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    playBlip();
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(currentLine.slice(0, i));
      if (i >= currentLine.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 18);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLine]);

  const handleNext = () => {
    if (isLastLineOfCutscene) return;
    if (isTyping) {
      setDisplayedText(currentLine);
      setIsTyping(false);
      return;
    }
    if (lineIndex < scene.lines.length - 1) {
      setLineIndex((prev) => prev + 1);
    } else {
      setSceneIndex((prev) => prev + 1);
      setLineIndex(0);
    }
  };

  // { replace: true } swaps this history entry instead of stacking a new
  // one on top — so pressing back from /login goes straight to wherever
  // you were BEFORE the cutscene, not back into the cutscene itself.
  const handleSkip = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      <BackgroundComponent />

      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled((prev) => !prev);
          }}
          aria-label="Toggle sound"
          className="font-pixel text-sm bg-white/80 text-ink-brown border-[3px] border-ink-brown w-9 h-9 flex items-center justify-center hover:bg-white transition-colors"
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>
        <button
          onClick={handleSkip}
          className="font-pixel text-[8px] bg-white/80 text-ink-brown border-[3px] border-ink-brown px-3 py-2 hover:bg-white transition-colors"
        >
          SKIP &gt;&gt;
        </button>
      </div>

      <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-10">
        <WispyMascot state="idle" size="lg" />
      </div>

      <div
        onClick={handleNext}
        className={`absolute bottom-0 left-0 w-full bg-black/80 border-t-4 border-white/20 p-6 z-20 ${isLastLineOfCutscene ? "" : "cursor-pointer"}`}
      >
        <p className="text-white text-sm md:text-base font-medium leading-relaxed min-h-[3em] max-w-3xl mx-auto">
          {displayedText}
          {isTyping && <span className="animate-pulse">▋</span>}
        </p>

        {isLastLineOfCutscene && !isTyping ? (
          <div className="flex gap-4 justify-center mt-4 max-w-3xl mx-auto">
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="font-pixel text-[10px] bg-titlebar-purple text-white border-4 border-white/30 px-6 py-3 hover:bg-hot-pink transition-colors"
            >
              LOGIN
            </button>
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="font-pixel text-[10px] bg-gold-accent text-ink-brown border-4 border-white/30 px-6 py-3 hover:bg-hot-pink hover:text-white transition-colors"
            >
              CREATE ACCOUNT
            </button>
          </div>
        ) : (
          <p className="text-white/50 text-xs mt-2 text-right max-w-3xl mx-auto font-pixel">
            {isTyping ? "tap to skip typing" : "tap to continue ▶"}
          </p>
        )}
      </div>
    </div>
  );
}