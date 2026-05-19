"use client";

import React, { createContext, useContext, useState, useEffect, startTransition } from "react";

type Theme = "warm" | "pure" | "newsprint" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "newsprint",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("newsprint");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) startTransition(() => setThemeState(saved));
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("theme", t);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}
