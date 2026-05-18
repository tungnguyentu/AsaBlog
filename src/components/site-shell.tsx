"use client";

import { useState, useEffect, ReactNode } from "react";
import { TopBar } from "./top-bar";
import { SiteFoot } from "./site-foot";
import { SearchOverlay } from "./search-overlay";
import type { SearchItem } from "@/lib/content";

type Props = {
  children: ReactNode;
  searchIndex: SearchItem[];
  searchRecents: string[];
};

export function SiteShell({ children, searchIndex, searchRecents }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global ⌘K / Ctrl+K / "/" shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (e.key === "/" && !searchOpen) {
        const tgt = e.target as HTMLElement;
        const isInput =
          tgt.tagName === "INPUT" ||
          tgt.tagName === "TEXTAREA" ||
          tgt.isContentEditable;
        if (isInput) return;
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  return (
    <div className="shell">
      <TopBar onOpenSearch={() => setSearchOpen(true)} />
      {children}
      <SiteFoot />
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchIndex={searchIndex}
        searchRecents={searchRecents}
      />
    </div>
  );
}
