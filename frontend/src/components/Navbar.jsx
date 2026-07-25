import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isNight = theme === "night";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      className={`w-full border-b-4 px-6 py-3 flex items-center justify-between shadow-[0_4px_0_0_rgba(74,63,82,0.15)] flex-shrink-0 transition-colors duration-300 ${
        isNight ? "bg-night-panel border-night-border" : "bg-titlebar-purple border-ink-brown"
      }`}
    >
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <span className="text-xl">🐾</span>
        <span className="font-pixel text-[12.5px] text-white tracking-wider">WISPY.EXE</span>
      </div>

      <span className={`font-pixel text-[9px] hidden sm:block ${isNight ? "text-night-text/70" : "text-white/80"}`}>
        WORKSPACE
      </span>

      <div className="flex items-center gap-3">
        {/* Day/Night toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle day/night theme"
          className={`text-lg px-2 py-1 border-[3px] transition-colors ${
            isNight ? "bg-night-card border-night-border" : "bg-cream border-ink-brown"
          }`}
        >
          {isNight ? "🌙" : "☀️"}
        </button>

        <button
          onClick={handleLogout}
          className="font-pixel text-[8px] bg-hot-pink text-white border-[3px] border-ink-brown px-3 py-2 hover:bg-gold-accent hover:text-ink-brown transition-colors active:translate-y-1 shadow-[3px_3px_0px_0px_#4A3F52]"
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
}