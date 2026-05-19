"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import { SearchOverlay } from "./search-overlay";
import type { SearchItem } from "@/lib/content";

type Props = {
  children: ReactNode;
  searchIndex: SearchItem[];
  searchRecents: string[];
};

export function SiteShell({ children, searchIndex, searchRecents }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

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
    <div className="wrap">
      <header className="head">
        <Link className="brand" href="/">
          Asa<span className="dot" />
          <span style={{ color: "var(--ink-soft)", fontStyle: "italic", fontSize: 15 }}>
            journal
          </span>
        </Link>
        <nav>
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
            writing
          </Link>
          <Link
            href="/decks/"
            aria-current={pathname.startsWith("/decks") || pathname.startsWith("/deck/") ? "page" : undefined}
          >
            decks
          </Link>
          <Link href="/about/">about</Link>
        </nav>
      </header>

      {children}

      <footer className="foot">
        <span>asa.zentry.site</span>
        <a href="#">rss</a>
      </footer>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchIndex={searchIndex}
        searchRecents={searchRecents}
      />
    </div>
  );
}
