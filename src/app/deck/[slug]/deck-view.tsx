"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { DeckSlide } from "@/lib/content";

type Props = { slides: DeckSlide[] };

function SlideBody({ slide }: { slide: DeckSlide }) {
  switch (slide.type) {
    case "title":
      return (
        <>
          <h1>
            Harness
            <br />
            Engineering.
          </h1>
          <p className="sub">
            Twelve short lectures on the loop that turns a model into a worker.
          </p>
        </>
      );

    case "loop":
      return (
        <>
          <h1>
            Every harness is a <em>closed</em> loop.
          </h1>
          <div className="flow-row">
            <span className="node">Intent</span>
            <span className="arr">→</span>
            <span className="node">Plan</span>
            <span className="arr">→</span>
            <span className="node">Execute</span>
            <span className="arr">→</span>
            <span className="node strong">Verify</span>
            <span className="arr">→</span>
            <span className="node strong">Record</span>
            <span className="arr">↺</span>
          </div>
        </>
      );

    case "boundary":
      return (
        <>
          <h1>
            Whatever the agent can&apos;t see,
            <br />
            <em>it cannot reason about.</em>
          </h1>
          <p className="sub">
            Drawing the visibility boundary is half the design work. Tools,
            memory, and context are not features — they&apos;re the surface of
            the world the agent inhabits.
          </p>
        </>
      );

    case "verify":
      return (
        <>
          <h1>Verification doesn&apos;t have to be smart.</h1>
          <ul className="bullets">
            <li>
              It has to be <em>specific</em>: a named property, not a
              vibe-check.
            </li>
            <li>Dumb verifiers compound trust. Smart verifiers can wait.</li>
            <li>
              No status, no progress. Status is the only progress that counts.
            </li>
          </ul>
        </>
      );

    case "close":
      return (
        <div className="quote">
          Closing the loop is the only progress that counts.
          <cite>— asa · journal vol. iii</cite>
        </div>
      );
  }
}

export default function DeckPage({ slides }: Props) {
  const [idx, setIdx] = useState(0);
  const last = slides.length - 1;

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(last, i + 1));

  // Keyboard navigation: ← → and Space
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement;
      const isInput =
        tgt.tagName === "INPUT" ||
        tgt.tagName === "TEXTAREA" ||
        tgt.isContentEditable;
      if (isInput) return;

      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // prev/next are stable closures over idx via setIdx callback — no deps needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="page">
      <div className="container">
        <nav className="crumbs">
          <Link href="/">asa</Link>
          <span className="sep">/</span>
          <Link href="/decks/">decks</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>harness engineering</span>
        </nav>

        <header className="post-head" style={{ paddingBottom: 20 }}>
          <div className="date">
            slide deck · {slides.length} slides · ←/→ to navigate
          </div>
          <h1 style={{ fontSize: "clamp(28px, 3.6vw, 40px)", marginBottom: 8 }}>
            Harness Engineering — slide deck.
          </h1>
        </header>

        <div className="deck-stage">
          <div className="deck-frame">
            {slides.map((s, i) => (
              <section
                key={i}
                className={"slide" + (i === idx ? " active" : "")}
                aria-hidden={i !== idx}
              >
                <div className="head">
                  <span>
                    <span className="dot" />
                    asa · harness eng.
                  </span>
                  <span>{s.n}</span>
                </div>

                <SlideBody slide={s} />

                <div className="foot">
                  {/* foot is [string, string] in YAML — cast from unknown index signature */}
                  <span>{(s.foot as string[])[0]}</span>
                  <span>
                    {i + 1} / {slides.length}
                  </span>
                  <span>{(s.foot as string[])[1]}</span>
                </div>
              </section>
            ))}
          </div>

          <div className="deck-controls">
            <button className="deck-btn" onClick={prev} disabled={idx === 0}>
              ← prev
            </button>
            <div className="pager">
              <span>
                {String(idx + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </span>
              <span className="deck-dots" style={{ marginLeft: 14 }}>
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={i === idx ? "active" : ""}
                    onClick={() => setIdx(i)}
                  />
                ))}
              </span>
            </div>
            <button className="deck-btn" onClick={next} disabled={idx === last}>
              next →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
