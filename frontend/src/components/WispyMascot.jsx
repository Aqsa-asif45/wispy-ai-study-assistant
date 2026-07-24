import React, { useState, useEffect } from "react";

/**
 * WispyMascot - retro pixel-art mascot with two looks:
 * - Day: grey cat
 * - Night: black witch-cat with a large green witch hat
 *
 * @param {string} state - 'idle', 'thinking', or 'happy'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {string} theme - 'day' or 'night' (defaults to 'day')
 */
export default function WispyMascot({ state = "idle", size = "md", theme = "day" }) {
  const [blink, setBlink] = useState(false);
  const isNight = theme === "night";

  useEffect(() => {
    if (state !== "idle") return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, [state]);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
  };

  const dayColors = {
    furDark: "#7d848a",
    furLight: "#9ba3af",
    innerEar: "#ffb4c2",
    outline: "#1d1f21",
    paw: "#e2e8f0",
    nose: "#ffb4c2",
    eyeShine: "#ffffff",
    labelIdle: "text-ink-brown",
    labelThinking: "text-ink-brown",
    labelHappy: "text-titlebar-purple",
  };

  const nightColors = {
    furDark: "#0f0f14",
    furLight: "#1f1f2b",
    innerEar: "#8B6FCE",
    outline: "#000000",
    paw: "#2E2154",
    nose: "#C4B5FD",
    eyeShine: "#A78BFA",
    labelIdle: "text-night-text",
    labelThinking: "text-night-text",
    labelHappy: "text-night-glow",
  };

  const c = isNight ? nightColors : dayColors;
  const eyeColor = isNight ? "#7CFC98" : c.outline;

  // Scaled Green Witch Hat (spans edge-to-edge)
  const GreenWitchHat = () => (
    <g id="green-witch-hat">
      {/* Wide Curved Brim */}
      <path
        d="M 1,22 Q 32,13 63,22 Q 32,27 1,22 Z"
        fill="#22c55e"
        stroke="#000000"
        strokeWidth="2"
      />
      {/* Curved Pointed Tip */}
      <path
        d="M 14,21 C 16,9 18,2 8,1 C 26,-2 40,9 50,21 Z"
        fill="#4ade80"
        stroke="#000000"
        strokeWidth="2"
      />
      {/* Dark Green Hat Band */}
      <path
        d="M 15,19 Q 32,14 49,19 L 48,21 Q 32,16 16,21 Z"
        fill="#15803d"
      />
    </g>
  );

  return (
    <div className={`relative flex flex-col items-center justify-center ${sizeClasses[size]} transition-all duration-300`}>
      {/* 1. THINKING / LOADING STATE */}
      {state === "thinking" && (
        <div className="animate-bounce flex flex-col items-center w-full h-full">
          <svg viewBox="0 0 64 64" className="w-full h-full pixelated overflow-visible">
            <rect x="34" y="24" width="28" height="24" fill={isNight ? "#241B42" : "#3a3d40"} stroke={c.outline} strokeWidth="2" />
            <rect x="38" y="28" width="20" height="14" fill={isNight ? "#A78BFA" : "#50e3c2"} />
            <rect x="42" y="32" width="12" height="3" fill="#ffffff" className="animate-pulse" />

            <polygon points="10,16 16,16 16,22 10,22" fill={c.furDark} />
            <polygon points="10,18 13,18 13,22 10,22" fill={c.innerEar} />

            <rect x="2" y="20" width="24" height="20" fill={c.furLight} stroke={c.outline} strokeWidth="2" />
            <rect x="14" y="26" width="6" height="4" fill={c.furDark} />
            <rect x="2" y="24" width="3" height="10" fill={c.furDark} />
            <rect x="18" y="24" width="3" height="5" fill={eyeColor} />

            <rect x="2" y="40" width="26" height="22" fill={c.furLight} stroke={c.outline} strokeWidth="2" />

            {/* Green Witch Hat */}
            {isNight && (
              <g transform="translate(-4, -2) scale(0.85)">
                <GreenWitchHat />
              </g>
            )}

            <rect x="22" y="44" width="8" height="5" fill={c.paw} stroke={c.outline} strokeWidth="2" className="animate-ping" style={{ animationDuration: '0.4s' }} />
          </svg>
          <span className={`text-xs font-silkscreen mt-1 animate-pulse ${c.labelThinking}`}>
            {isNight ? "Wispy is brewing an answer..." : "Wispy is thinking..."}
          </span>
        </div>
      )}

      {/* 2. HAPPY / SUCCESS STATE */}
      {state === "happy" && (
        <div className="flex flex-col items-center w-full h-full">
          <div className="absolute top-0 flex justify-between w-full px-2 animate-ping z-20">
            {isNight ? (
              <>
                <span className="text-purple-300">✦</span>
                <span className="text-yellow-300">☆</span>
                <span className="text-purple-300">✧</span>
              </>
            ) : (
              <>
                <span className="text-red-400">♥</span>
                <span className="text-yellow-400">✦</span>
                <span className="text-blue-400">♥</span>
              </>
            )}
          </div>

          <svg viewBox="0 0 64 64" className="w-full h-full pixelated animate-bounce overflow-visible" style={{ animationDuration: '0.8s' }}>
            {/* Ears */}
            <polygon points="6,16 16,16 16,24 6,24" fill={c.furLight} stroke={c.outline} strokeWidth="2" />
            <polygon points="8,18 14,18 14,24 8,24" fill={c.innerEar} />
            <polygon points="48,16 58,16 58,24 48,24" fill={c.furLight} stroke={c.outline} strokeWidth="2" />
            <polygon points="50,18 56,18 56,24 50,24" fill={c.innerEar} />

            {/* Head */}
            <rect x="4" y="22" width="56" height="26" fill={c.furLight} stroke={c.outline} strokeWidth="2" />

            {/* Happy Eyes */}
            <path d="M 12,34 L 18,28 L 24,34" fill="none" stroke={eyeColor} strokeWidth="2.5" />
            <path d="M 40,34 L 46,28 L 52,34" fill="none" stroke={eyeColor} strokeWidth="2.5" />

            {/* Body */}
            <rect x="10" y="48" width="44" height="15" fill={c.furLight} stroke={c.outline} strokeWidth="2" />

            {/* Green Witch Hat */}
            {isNight && (
              <g transform="translate(0, 3)">
                <GreenWitchHat />
              </g>
            )}
          </svg>
          <span className={`text-xs font-silkscreen mt-1 font-bold animate-pulse ${c.labelHappy}`}>
            {isNight ? "A spell well cast!" : "Yay! We did it!"}
          </span>
        </div>
      )}

      {/* 3. IDLE STATE */}
      {state === "idle" && (
        <svg viewBox="0 0 64 64" className="w-full h-full pixelated overflow-visible">
          {/* Max-sized Ears */}
          <polygon points="6,18 16,18 16,26 6,26" fill={c.furLight} stroke={c.outline} strokeWidth="2" />
          <polygon points="8,20 14,20 14,26 8,26" fill={c.innerEar} />
          <polygon points="48,18 58,18 58,26 48,26" fill={c.furLight} stroke={c.outline} strokeWidth="2" />
          <polygon points="50,20 56,20 56,26 50,26" fill={c.innerEar} />

          {/* Max-sized Head */}
          <rect x="4" y="24" width="56" height="25" fill={c.furLight} stroke={c.outline} strokeWidth="2" />
          <rect x="6" y="28" width="5" height="15" fill={c.furDark} />
          <rect x="53" y="28" width="5" height="15" fill={c.furDark} />

          {/* Eyes */}
          {blink ? (
            <>
              <rect x="14" y="34" width="8" height="2" fill={eyeColor} />
              <rect x="42" y="34" width="8" height="2" fill={eyeColor} />
            </>
          ) : (
            <>
              <rect x="14" y="32" width="8" height="8" fill={eyeColor} />
              <rect x="14" y="32" width="3" height="3" fill={c.eyeShine} />
              <rect x="42" y="32" width="8" height="8" fill={eyeColor} />
              <rect x="42" y="32" width="3" height="3" fill={c.eyeShine} />
            </>
          )}

          {/* Nose and Mouth */}
          <rect x="30" y="39" width="4" height="2" fill={c.nose} />
          <path d="M 27,42 C 29,44 31,44 32,42 C 33,44 35,44 37,42" fill="none" stroke={c.outline} strokeWidth="1.5" />

          {/* Max-sized Body & Paws */}
          <rect x="10" y="49" width="44" height="11" fill={c.furLight} stroke={c.outline} strokeWidth="2" />
          <rect x="14" y="58" width="8" height="5" fill={c.paw} stroke={c.outline} strokeWidth="2" />
          <rect x="42" y="58" width="8" height="5" fill={c.paw} stroke={c.outline} strokeWidth="2" />

          {/* Tail */}
          <g className="origin-right animate-tail-wag">
            <rect x="54" y="48" width="9" height="5" fill={c.furDark} stroke={c.outline} strokeWidth="2" />
            <rect x="60" y="42" width="4" height="8" fill={c.furDark} stroke={c.outline} strokeWidth="2" />
          </g>

          {/* Green Witch Hat */}
          {isNight && (
            <g transform="translate(0, 5)">
              <GreenWitchHat />
            </g>
          )}
        </svg>
      )}
    </div>
  );
}