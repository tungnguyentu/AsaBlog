"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Post } from "@/lib/content";
import { useLang } from "@/context/lang-context";

const EN_COPY = {
  kicker: "journal · vol. iii · 2026",
  h1a: "Field notes from building",
  h1b: "quiet, observable",
  h1c: ", stubbornly verifiable software.",
  subBefore: "A small log by ",
  subAfter:
    " — short essays, diagrams, and the occasional slide deck. Mostly about agent harnesses, control loops, and what stays after the demo ends.",
  metaA: (n: number) => `${String(n).padStart(2, "0")} ${n === 1 ? "entry" : "entries"}`,
  metaB: "updated 18·05·26",
  metaC: "english · tiếng việt",
  section: "recent writing",
  filterLbl: "filter",
};

const VI_COPY = {
  kicker: "nhật ký · tập iii · 2026",
  h1a: "Ghi chép từ việc xây",
  h1b: "phần mềm yên tĩnh, quan sát được",
  h1c: ", và bướng bỉnh dễ kiểm chứng.",
  subBefore: "Một sổ tay nhỏ của ",
  subAfter:
    " — bài ngắn, sơ đồ, và đôi khi là slide deck. Chủ yếu về agent harness, vòng điều khiển, và những gì còn lại sau khi demo kết thúc.",
  metaA: (n: number) => `${String(n).padStart(2, "0")} bài viết`,
  metaB: "cập nhật 18·05·26",
  metaC: "english · tiếng việt",
  section: "bài viết gần đây",
  filterLbl: "lọc",
};

type Props = { posts: Post[] };

export default function HomeView({ posts }: Props) {
  const { lang } = useLang();
  const copy = lang === "vi" ? VI_COPY : EN_COPY;

  const [activeTag, setActiveTag] = useState("all");

  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return ["all", ...Array.from(s)];
  }, [posts]);

  const visiblePosts = useMemo(() => {
    if (activeTag === "all") return posts;
    return posts.filter((p) => p.tags.includes(activeTag));
  }, [activeTag, posts]);

  return (
    <main className="page">
      {/* Hero */}
      <section className="container hero">
        <div className="hero-kicker">
          <span className="pulse" />
          <span>{copy.kicker}</span>
        </div>
        <h1 className="serif">
          {copy.h1a}
          <br />
          <em>{copy.h1b}</em>
          <span className="ink-soft">{copy.h1c}</span>
        </h1>
        <p className="hero-sub">
          {copy.subBefore}
          <span style={{ color: "var(--ink)" }}>Asa</span>
          {copy.subAfter}
        </p>
        <div className="hero-meta">
          <span>{copy.metaA(posts.length)}</span>
          <span className="sep" />
          <span>{copy.metaB}</span>
          <span className="sep" />
          <span>{copy.metaC}</span>
        </div>
      </section>

      <section className="container">
        {/* Post list */}
        <div className="section-rule">
          <h2>{copy.section}</h2>
          <span className="count">
            {String(visiblePosts.length).padStart(2, "0")} /{" "}
            {String(posts.length).padStart(2, "0")}
          </span>
        </div>

        <div className="filters">
          <span className="lbl">{copy.filterLbl}</span>
          {allTags.map((t) => (
            <button
              key={t}
              className="filter-chip"
              aria-pressed={activeTag === t}
              onClick={() => setActiveTag(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <ul className="post-list">
          {visiblePosts.map((p) => {
            const inner = (
              <>
                <div className="post-date">
                  <b>
                    {p.dateShort.m} {p.dateShort.d}
                  </b>
                  <span>{p.readLabel}</span>
                </div>
                <div>
                  <h3 className="post-title">{p.title}</h3>
                  <p className="post-excerpt">{p.excerpt}</p>
                  <div className="post-tags">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className={"tag" + (t === activeTag ? " active" : "")}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveTag(t === activeTag ? "all" : t);
                        }}
                      >
                        {t}
                      </span>
                    ))}
                    {p.placeholder && (
                      <span
                        className="tag"
                        style={{ color: "var(--ink-mute)" }}
                      >
                        draft
                      </span>
                    )}
                  </div>
                </div>
                <span className="post-arrow">›</span>
              </>
            );

            // Placeholder posts render but are not navigable
            return (
              <li key={p.slug} className="post-item">
                {p.placeholder ? (
                  inner
                ) : (
                  <Link
                    href={`/post/${p.slug}/`}
                    style={{ display: "contents" }}
                  >
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
