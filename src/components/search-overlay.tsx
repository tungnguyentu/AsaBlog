"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  KeyboardEvent,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { SearchItem } from "@/lib/content";

function SearchGlass() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function highlight(text: string, q: string): ReactNode {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  searchIndex: SearchItem[];
  searchRecents: string[];
};

export function SearchOverlay({ open, onClose, searchIndex, searchRecents }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase().trim();
    return searchIndex.filter((r) => r.haystack.includes(needle)).slice(0, 12);
  }, [q]);

  const grouped = useMemo(() => {
    const order = [
      { kind: "post" as const, label: "writing" },
      { kind: "lecture" as const, label: "lectures" },
      { kind: "page" as const, label: "pages" },
    ];
    return order
      .map(({ kind, label }) => ({
        kind,
        label,
        items: results.filter((r) => r.kind === kind),
      }))
      .filter((g) => g.items.length > 0);
  }, [results]);

  // When no query: show page jumps; when querying: show grouped results
  const flat = useMemo(() => {
    if (q.trim()) return grouped.flatMap((g) => g.items);
    return searchIndex.filter((r) => r.kind === "page");
  }, [grouped, q]);

  useEffect(() => {
    setSel(0);
  }, [q]);

  // Keep selected item scrolled into view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pr = listRef.current.getBoundingClientRect();
    if (r.bottom > pr.bottom) {
      listRef.current.scrollTop += r.bottom - pr.bottom + 8;
    } else if (r.top < pr.top) {
      listRef.current.scrollTop -= pr.top - r.top + 8;
    }
  }, [sel, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSel((s) => Math.min(s + 1, Math.max(flat.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSel((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = flat[sel];
        if (item?.href) {
          router.push(item.href);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, sel, router, onClose]);

  if (!open) return null;

  let runningIdx = -1;

  function renderItem(r: SearchItem, key: string, withHL: boolean) {
    runningIdx++;
    const i = runningIdx;
    const handleClick = () => {
      if (r.href) {
        router.push(r.href);
        onClose();
      }
    };

    return (
      <div
        key={key}
        className="sx-item"
        aria-selected={sel === i}
        onMouseEnter={() => setSel(i)}
        onClick={handleClick}
      >
        <span className="icn">{r.icon}</span>
        <div style={{ minWidth: 0 }}>
          <div className="ttl">{withHL ? highlight(r.title, q) : r.title}</div>
          <div className="sub">{withHL ? highlight(r.sub, q) : r.sub}</div>
        </div>
        <div className="right">
          {r.meta} <span className="enter">⏎</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="sx-scrim"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="sx-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sx-input-wrap">
          <span className="ic">
            <SearchGlass />
          </span>
          <input
            ref={inputRef}
            className="sx-input"
            placeholder="Search writing, lectures, pages…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
          <span className="sx-kbd">esc</span>
        </div>

        <div className="sx-results" ref={listRef}>
          {!q.trim() && (
            <>
              <div className="sx-group-label">
                <span>recent</span>
                <span className="count">{searchRecents.length}</span>
              </div>
              <div className="sx-recents-row">
                {searchRecents.map((r) => (
                  <button key={r} className="chip" onClick={() => setQ(r)}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="sx-group-label">
                <span>jump to</span>
              </div>
              {searchIndex.filter((r) => r.kind === "page").map((r, k) =>
                renderItem(r, "j-" + k, false)
              )}
            </>
          )}

          {q.trim() && grouped.length === 0 && (
            <div className="sx-empty">
              <div className="big">No matches for &ldquo;{q}&rdquo;.</div>
              <div className="small">try: harness · verify · boundary</div>
            </div>
          )}

          {q.trim() &&
            grouped.map((g) => (
              <div key={g.kind}>
                <div className="sx-group-label">
                  <span>{g.label}</span>
                  <span className="count">{g.items.length}</span>
                </div>
                {g.items.map((r, k) => renderItem(r, g.kind + "-" + k, true))}
              </div>
            ))}
        </div>

        <div className="sx-foot">
          <div className="legend">
            <span className="pair">
              <span className="sx-kbd">↑↓</span> navigate
            </span>
            <span className="pair">
              <span className="sx-kbd">⏎</span> open
            </span>
            <span className="pair">
              <span className="sx-kbd">⌘K</span> toggle
            </span>
          </div>
          <div className="brand-line">
            <span className="dot" /> asa search
          </div>
        </div>
      </div>
    </div>
  );
}
