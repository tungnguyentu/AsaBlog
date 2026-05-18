"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Lecture } from "@/lib/content";

type Props = { lectures: Lecture[] };

export default function ReaderPage({ lectures }: Props) {
  const [activeId, setActiveId] = useState("L1");
  const [progress, setProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bodyRef = useRef<HTMLElement>(null);

  // IntersectionObserver to track which lecture heading is in view
  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll<HTMLElement>("[data-lec]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveId(e.target.getAttribute("data-lec") ?? "L1");
          }
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  // Scroll to lecture from hash on mount (e.g., navigated from search overlay)
  useEffect(() => {
    const hash = window.location.hash; // e.g. "#L1"
    if (!hash) return;
    const id = hash.slice(1);
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`[data-lec="${id}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max <= 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / max));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function scrollToLecture(id: string) {
    const el = document.querySelector<HTMLElement>(`[data-lec="${id}"]`);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 90,
        behavior: "smooth",
      });
    }
  }

  function copyAnchor(id: string) {
    const url = window.location.origin + window.location.pathname + "#" + id;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedId(id);
    setTimeout(
      () => setCopiedId((c) => (c === id ? null : c)),
      1100
    );
  }

  return (
    <main className="page">
      {/* Terracotta reading progress bar */}
      <div className="read-progress" aria-hidden="true">
        <div
          className="bar"
          style={{ width: (progress * 100).toFixed(1) + "%" }}
        />
      </div>

      <div className="container">
        <nav className="crumbs">
          <Link href="/">asa</Link>
          <span className="sep">/</span>
          <Link href="/post/harness-engineering/">harness engineering</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>reader</span>
        </nav>

        <div className="reader-shell">
          {/* Sticky TOC */}
          <aside className="reader-toc" aria-label="Lectures">
            <div className="toc-label">contents</div>
            {lectures.map((l) => (
              <a
                key={l.id}
                href={"#" + l.id}
                className={l.id === activeId ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToLecture(l.id);
                }}
              >
                {l.title}
              </a>
            ))}
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--ink-mute)" }}>
              …and 8 more
            </a>
          </aside>

          {/* Article body */}
          <article className="reader-body" ref={bodyRef}>
            {lectures.map((l) => (
              <section key={l.id} data-lec={l.id} id={l.id}>
                <div className="lec-meta">{l.num}</div>
                <h2>
                  <a
                    href={"#" + l.id}
                    className={
                      "anchor" + (copiedId === l.id ? " copied" : "")
                    }
                    aria-label={
                      copiedId === l.id
                        ? "Link copied"
                        : "Copy link to lecture"
                    }
                    title={copiedId === l.id ? "copied" : "copy link"}
                    onClick={(e) => {
                      e.preventDefault();
                      copyAnchor(l.id);
                    }}
                  >
                    {copiedId === l.id ? "✓" : "§"}
                  </a>
                  {l.title}
                </h2>
                <p>
                  <span className="lead">{l.lead}</span>
                </p>
                <div className="rn-pair">
                  <div className="label">R · reader</div>
                  <p>{l.r}</p>
                  <div className="label" style={{ marginTop: 14 }}>
                    N · note
                  </div>
                  <p>{l.note}</p>
                  <p className="needed">— {l.notes}</p>
                </div>
              </section>
            ))}

            <div className="reader-actions">
              <Link href="/post/harness-engineering/">← back to overview</Link>
              <Link href="/deck/harness-engineering/">open slide deck →</Link>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
