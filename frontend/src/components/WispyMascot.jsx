import React, { useState, useEffect } from "react";

/**
 * WispyMascot - A retro pixel-art grey cat component.
 * @param {string} state - 'idle', 'thinking' (loading), or 'happy' (celebration)
 * @param {string} size - 'sm', 'md', 'lg'
 */
export default function WispyMascot({ state = "idle", size = "md" }) {
  const [blink, setBlink] = useState(false);

  // Simple loop to simulate idle eye blinking
  useEffect(() => {
    if (state !== "idle") return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200); // Quick blink duration
    }, 4000); // Blink every 4 seconds
    return () => clearInterval(interval);
  }, [state]);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${sizeClasses[size]} transition-all duration-300`}>
      {/* 1. THINKING / LOADING STATE */}
      {state === "thinking" && (
        <div className="animate-bounce flex flex-col items-center">
          <svg viewBox="0 0 64 64" className="w-full h-full pixelated">
            {/* Retro Computer Monitor */}
            <rect x="36" y="24" width="24" height="20" fill="#3a3d40" stroke="#1d1f21" strokeWidth="2" />
            <rect x="39" y="27" width="18" height="12" fill="#50e3c2" />
            <rect x="42" y="30" width="12" height="2" fill="#ffffff" className="animate-pulse" />
            {/* Monitor Stand */}
            <rect x="46" y="44" width="4" height="4" fill="#1d1f21" />
            <rect x="42" y="48" width="12" height="2" fill="#1d1f21" />

            {/* Grey Cat - Wispy (Profile Typing View) */}
            {/* Ears */}
            <polygon points="12,12 16,12 16,18 12,18" fill="#7d848a" />
            <polygon points="12,14 14,14 14,18 12,18" fill="#ffb4c2" /> {/* Inner Ear Pink */}
            
            {/* Head */}
            <rect x="4" y="16" width="20" height="16" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
            {/* Cheek Patch */}
            <rect x="14" y="22" width="6" height="4" fill="#7d848a" />
            {/* Back Head Fur */}
            <rect x="4" y="20" width="2" height="8" fill="#7d848a" />
            {/* Eye (Looking intently at screen) */}
            <rect x="18" y="20" width="2" height="4" fill="#1d1f21" />
            
            {/* Body */}
            <rect x="4" y="32" width="22" height="20" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
            
            {/* Paws on Keyboard */}
            <rect x="22" y="36" width="6" height="4" fill="#e2e8f0" stroke="#1d1f21" strokeWidth="2" className="animate-ping" style={{ animationDuration: '0.4s' }} />
            <rect x="24" y="38" width="6" height="4" fill="#e2e8f0" stroke="#1d1f21" strokeWidth="2" className="animate-bounce" style={{ animationDuration: '0.3s' }} />

            {/* Tail */}
            <path d="M 4,46 L 2,46 L 2,42 L 0,42 L 0,34 L 2,34 L 2,38 L 4,38 Z" fill="#7d848a" stroke="#1d1f21" strokeWidth="1" className="origin-bottom-left animate-wiggle" />
          </svg>
          <span className="text-xs font-silkscreen text-ink-brown mt-2 animate-pulse">Wispy is thinking...</span>
        </div>
      )}

      {/* 2. HAPPY / SUCCESS STATE */}
      {state === "happy" && (
        <div className="flex flex-col items-center">
          {/* Confetti & Sparkles */}
          <div className="absolute top-0 flex justify-between w-full px-4 animate-ping">
            <span className="text-red-400">♥</span>
            <span className="text-yellow-400">✦</span>
            <span className="text-blue-400">♥</span>
          </div>

          <svg viewBox="0 0 64 64" className="w-full h-full pixelated animate-bounce" style={{ animationDuration: '0.8s' }}>
            {/* Left Ear */}
            <polygon points="14,10 22,10 22,18 14,18" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
            <polygon points="16,12 20,12 20,18 16,18" fill="#ffb4c2" />
            {/* Right Ear */}
            <polygon points="42,10 50,10 50,18 42,18" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
            <polygon points="44,12 48,12 48,18 44,18" fill="#ffb4c2" />

            {/* Cat Head */}
            <rect x="12" y="16" width="40" height="24" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
            {/* Cheeks (Cute pink blush) */}
            <rect x="16" y="30" width="6" height="4" fill="#ffb4c2" />
            <rect x="42" y="30" width="6" height="4" fill="#ffb4c2" />

            {/* Happy Closed Eyes ( ^  ^ ) */}
            <path d="M 18,26 L 22,22 L 26,26" fill="none" stroke="#1d1f21" strokeWidth="2" />
            <path d="M 38,26 L 42,22 L 46,26" fill="none" stroke="#1d1f21" strokeWidth="2" />

            {/* Mouth */}
            <path d="M 28,32 L 32,34 L 36,32" fill="none" stroke="#1d1f21" strokeWidth="2" />

            {/* Cat Body */}
            <rect x="18" y="40" width="28" height="18" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
            
            {/* Happy Raised Paws */}
            <rect x="12" y="36" width="6" height="8" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
            <rect x="46" y="36" width="6" height="8" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
            
            {/* Wiggling Tail */}
            <path d="M 46,48 L 54,44 L 58,48 C 60,48 62,40 54,40 Z" fill="#7d848a" stroke="#1d1f21" strokeWidth="1" className="animate-ping" style={{ animationDuration: '0.6s' }} />
          </svg>
          <span className="text-xs font-silkscreen text-titlebar-purple mt-2 font-bold animate-pulse">Yay! We did it!</span>
        </div>
      )}

      {/* 3. IDLE STATE */}
      {state === "idle" && (
        <svg viewBox="0 0 64 64" className="w-full h-full pixelated">
          {/* Left Ear */}
          <polygon points="14,14 22,14 22,22 14,22" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
          <polygon points="16,16 20,16 20,22 16,22" fill="#ffb4c2" />
          {/* Right Ear */}
          <polygon points="42,14 50,14 50,22 42,22" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
          <polygon points="44,14 48,14 48,22 44,22" fill="#ffb4c2" />

          {/* Cat Head */}
          <rect x="12" y="20" width="40" height="22" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
          
          {/* Cheeks */}
          <rect x="14" y="26" width="4" height="12" fill="#7d848a" />
          <rect x="46" y="26" width="4" height="12" fill="#7d848a" />

          {/* Eyes (Blinks based on state) */}
          {blink ? (
            <>
              {/* Closed Eyes (Lines) */}
              <rect x="20" y="28" width="6" height="2" fill="#1d1f21" />
              <rect x="38" y="28" width="6" height="2" fill="#1d1f21" />
            </>
          ) : (
            <>
              {/* Open Eyes */}
              <rect x="20" y="26" width="6" height="6" fill="#1d1f21" />
              <rect x="20" y="26" width="2" height="2" fill="#ffffff" /> {/* Eye Shine */}
              <rect x="38" y="26" width="6" height="6" fill="#1d1f21" />
              <rect x="38" y="26" width="2" height="2" fill="#ffffff" /> {/* Eye Shine */}
            </>
          )}

          {/* Nose */}
          <rect x="31" y="32" width="2" height="2" fill="#ffb4c2" />

          {/* Mouth */}
          <path d="M 29,34 C 30,35 31,35 32,34 C 33,35 34,35 35,34" fill="none" stroke="#1d1f21" strokeWidth="1.5" />

          {/* Cat Body */}
          <rect x="16" y="42" width="32" height="16" fill="#9ba3af" stroke="#1d1f21" strokeWidth="2" />
          {/* Stripes/Patterns on body */}
          <rect x="20" y="46" width="4" height="8" fill="#7d848a" />
          <rect x="40" y="46" width="4" height="8" fill="#7d848a" />

          {/* Paws */}
          <rect x="20" y="56" width="6" height="4" fill="#e2e8f0" stroke="#1d1f21" strokeWidth="2" />
          <rect x="38" y="56" width="6" height="4" fill="#e2e8f0" stroke="#1d1f21" strokeWidth="2" />

          {/* Tail (Wagging Animation) */}
          <g className="origin-right animate-tail-wag">
            <rect x="48" y="46" width="10" height="4" fill="#7d848a" stroke="#1d1f21" strokeWidth="2" />
            <rect x="56" y="42" width="4" height="6" fill="#7d848a" stroke="#1d1f21" strokeWidth="2" />
          </g>
        </svg>
      )}
    </div>
  );
}
