import React, { createContext, useContext, useState, useEffect } from "react";

// React Context = a way to share one value (here, "day" or "night")
// with any component in the tree, without manually passing it down
// through props at every level.
const ThemeContext = createContext(null);

const STORAGE_KEY = "wispy-theme";

export function ThemeProvider({ children }) {
  // Read a saved choice from localStorage on first load, so refreshing
  // the page doesn't reset you back to day mode. Falls back to "day".
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "night" ? "night" : "day";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "day" ? "night" : "day"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// A small custom hook so any component just calls useTheme() instead
// of importing useContext + ThemeContext separately every time.
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
}