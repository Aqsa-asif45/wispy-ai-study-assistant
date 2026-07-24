import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { signInUser, signUpUser } from "../../lib/api";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill out all fields.");

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpUser(email, password);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        alert("Account forged! Check your email for a verification link, then log in.");
        setIsSignUp(false);
      } else {
        const data = await signInUser(email, password);
        localStorage.setItem("token", data.access_token);
        navigate("/workspace", { replace: true });
      }
    } catch (err) {
      alert(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blush-pink flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(#4A3F52 2px, transparent 2px), linear-gradient(90deg, #4A3F52 2px, transparent 2px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(244,166,198,0.35) 0%, rgba(201,168,224,0.15) 45%, transparent 70%)'
        }}
      />

      {/* Clickable logo — the only way back to Landing from this page */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer mb-6 relative z-10"
      >
        <span className="text-2xl">🐾</span>
        <span className="font-pixel text-xs tracking-wider text-titlebar-purple">WISPY.EXE</span>
      </div>

      <div className="nes-container with-title is-rounded bg-white max-w-md w-full shadow-lg relative z-10">
        <p className="title font-silkscreen text-sm">
          {isSignUp ? "Join Wispy Study Hub 🐾" : "Log Into Workspace 🔒"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="nes-field">
            <label htmlFor="email_field" className="text-xs font-bold">Email Address</label>
            <input
              type="email"
              id="email_field"
              className="nes-input text-xs"
              placeholder="pixel_scholar@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="nes-field">
            <label htmlFor="password_field" className="text-xs font-bold">Password</label>
            <input
              type="password"
              id="password_field"
              className="nes-input text-xs"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`nes-btn w-full ${loading ? "is-disabled" : "is-primary"}`}
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
            </button>

            <button
              type="button"
              className="text-[10px] text-purple-700 hover:underline text-center block mt-2 w-full font-silkscreen"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              {isSignUp ? "Already have an account? Log in" : "New user? Create a profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}