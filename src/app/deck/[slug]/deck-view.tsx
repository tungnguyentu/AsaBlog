"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { DeckSlide } from "@/lib/content";
import { useLang } from "@/context/lang-context";

type Props = { slides: DeckSlide[] };

const SLIDE_COPY = {
  en: {
    title:    { h: ["Harness", "Engineering."], sub: "Twelve short lectures on the loop that turns a model into a worker." },
    loop:     { h: ["Every harness is a ", "closed", " loop."], nodes: ["Intent","Plan","Execute","Verify","Record"] },
    boundary: { h: ["Whatever the agent can't see,", "it cannot reason about."], sub: "Drawing the visibility boundary is half the design work. Tools, memory, and context are not features — they're the surface of the world the agent inhabits." },
    verify:   { h: "Verification doesn't have to be smart.", bullets: ["It has to be specific: a named property, not a vibe-check.", "Dumb verifiers compound trust. Smart verifiers can wait.", "No status, no progress. Status is the only progress that counts."] },
    close:    { q: "Closing the loop is the only progress that counts.", cite: "— asa · journal vol. iii" },
  },
  vi: {
    title:    { h: ["Harness", "Engineering."], sub: "Mười hai bài giảng ngắn về vòng lặp biến mô hình thành người thực thi." },
    loop:     { h: ["Mỗi harness là một vòng lặp ", "khép kín", "."], nodes: ["Dự định","Lập kế hoạch","Thực thi","Xác minh","Ghi lại"] },
    boundary: { h: ["Những gì agent không thể thấy,", "nó không thể lý luận về."], sub: "Vẽ ranh giới hiển thị là một nửa công việc thiết kế. Công cụ, bộ nhớ và ngữ cảnh không phải là tính năng — chúng là bề mặt thế giới mà agent sinh sống." },
    verify:   { h: "Xác minh không cần phải thông minh.", bullets: ["Nó phải cụ thể: một thuộc tính được đặt tên, không phải cảm tính.", "Các bộ xác minh đơn giản tích lũy niềm tin. Bộ thông minh có thể chờ đợi.", "Không có trạng thái, không có tiến độ. Trạng thái là tiến độ duy nhất có giá trị."] },
    close:    { q: "Đóng vòng lặp là tiến độ duy nhất có giá trị.", cite: "— asa · nhật ký tập iii" },
  },
};

function SlideBody({ slide, lang }: { slide: DeckSlide; lang: "en" | "vi" }) {
  const c = SLIDE_COPY[lang];

  switch (slide.type) {
    case "title":
      return (
        <>
          <h1>{c.title.h[0]}<br />{c.title.h[1]}</h1>
          <p className="sub">{c.title.sub}</p>
        </>
      );

    case "loop":
      return (
        <>
          <h1>{c.loop.h[0]}<em>{c.loop.h[1]}</em>{c.loop.h[2]}</h1>
          <div className="flow-row">
            {c.loop.nodes.map((node, i) => (
              <>
                <span key={node} className={"node" + (i >= 3 ? " strong" : "")}>{node}</span>
                {i < c.loop.nodes.length - 1 && <span className="arr">→</span>}
              </>
            ))}
            <span className="arr">↺</span>
          </div>
        </>
      );

    case "boundary":
      return (
        <>
          <h1>{c.boundary.h[0]}<br /><em>{c.boundary.h[1]}</em></h1>
          <p className="sub">{c.boundary.sub}</p>
        </>
      );

    case "verify":
      return (
        <>
          <h1>{c.verify.h}</h1>
          <ul className="bullets">
            {c.verify.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </>
      );

    case "close":
      return (
        <div className="quote">
          {c.close.q}
          <cite>{c.close.cite}</cite>
        </div>
      );
  }
}

export default function DeckPage({ slides }: Props) {
  const { lang } = useLang();
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
            {lang === "vi"
              ? `slide deck · ${slides.length} trang · ←/→ để điều hướng`
              : `slide deck · ${slides.length} slides · ←/→ to navigate`}
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

                <SlideBody slide={s} lang={lang} />

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
