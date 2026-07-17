import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser, signUpUser } from "../../lib/api"; // Ensure the relative path matches your folder tree
// We will build these auth API hooks next!
// import { signInUser, signUpUser } from "../../lib/api"; 

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
      alert("Account forged! Check your email for a verification link, then log in.");
      setIsSignUp(false); // Flip them back to the login view automatically
    } else {
      const data = await signInUser(email, password);
      // Save the JWT secure token in local storage
      localStorage.setItem("token", data.access_token);
      // Proceed safely past the Route Guard straight into the workspace!
      navigate("/workspace");
    }
  } catch (err) {
    alert(err.message || "Authentication failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-blush-pink flex items-center justify-center p-4 font-sans">
      <div className="nes-container with-title is-rounded bg-white max-w-md w-full shadow-lg">
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