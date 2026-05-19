"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/context/lang-context";

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function RssIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1.4" fill="currentColor" />
    </svg>
  );
}

type Props = {
  onOpenSearch: () => void;
};

export function TopBar({ onOpenSearch }: Props) {
  const pathname = usePathname();
  const { lang, setLang } = useLang();

  const isWriting = pathname === "/";
  const isDecks = pathname.startsWith("/deck");
  const isAbout = pathname === "/about/";

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" href="/">
          Asa
          <span className="brand-dot" />
          <span className="ink-soft" style={{ fontWeight: 400, fontStyle: "italic", fontSize: 15 }}>
            journal
          </span>
        </Link>

        <nav className="nav">
          <Link href="/" aria-current={isWriting ? "page" : undefined}>
            Writing
          </Link>
          <Link href="/decks/" aria-current={isDecks ? "page" : undefined}>
            Decks
          </Link>
          <Link href="/about/" aria-current={isAbout ? "page" : undefined}>
            About
          </Link>

          <span className="lang-switch" role="group" aria-label="Language">
            <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>
              en
            </button>
            <button aria-pressed={lang === "vi"} onClick={() => setLang("vi")}>
              vi
            </button>
          </span>

          <span className="row" style={{ gap: 4, marginLeft: 8 }}>
            <button
              className="iconbtn"
              title="Search (⌘K)"
              aria-label="Search"
              onClick={onOpenSearch}
            >
              <SearchIcon />
            </button>
            <span
              className="kbd-chip"
              style={{ cursor: "pointer" }}
              onClick={onOpenSearch}
              title="Open search"
            >
              ⌘K
            </span>
            <button className="iconbtn" title="RSS" aria-label="RSS">
              <RssIcon />
            </button>
          </span>
        </nav>
      </div>
    </header>
  );
}
