"use client";

import { useTheme } from "@/components/theme-provider";

const PALETTES = [
  { id: "warm", label: "warm" },
  { id: "pure", label: "pure" },
  { id: "newsprint", label: "news" },
  { id: "dark", label: "dark" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ display: "flex", gap: 0 }}>
      {PALETTES.map((p, i) => (
        <button
          key={p.id}
          className="theme-btn"
          aria-pressed={theme === p.id}
          onClick={() => setTheme(p.id)}
          style={{
            borderRight: i < PALETTES.length - 1 ? "none" : undefined,
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
