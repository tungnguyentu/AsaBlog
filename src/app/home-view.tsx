"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Post } from "@/lib/content";
import { useLang } from "@/context/lang-context";

const EN_COPY = {
  introH: ["Field notes on quiet, ", "verifiable", " software."],
  introP: "A small log — short essays on agent harnesses, control loops, and what stays after the demo ends.",
  seriesLabel: "in series",
  seriesTitle: "Harness Engineering — twelve lectures on the loop.",
  seriesDesc: "The closed loop, the visibility boundary, the state machine — and nine more lectures on what makes an agent harness keep working in the wild.",
  seriesMeta: "essay · reader · deck",
  seriesResume: "resume reading →",
  section: "recent writing",
  filterLbl: "filter",
};

const VI_COPY = {
  introH: ["Ghi chép về phần mềm yên tĩnh, ", "có thể kiểm chứng", "."],
  introP: "Nhật ký nhỏ — bài ngắn về agent harness, vòng điều khiển, và những gì còn lại sau khi demo kết thúc.",
  seriesLabel: "loạt bài",
  seriesTitle: "Harness Engineering — mười hai bài giảng về vòng lặp.",
  seriesDesc: "Vòng lặp khép kín, ranh giới hiển thị, máy trạng thái — và chín bài giảng nữa về cách agent harness hoạt động trong thực tế.",
  seriesMeta: "essay · reader · deck",
  seriesResume: "tiếp tục đọc →",
  section: "bài viết gần đây",
  filterLbl: "lọc",
};

type Props = { posts: Post[]; lectureCount: number };

export default function HomeView({ posts, lectureCount }: Props) {
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
      <section className="container">
        <div className="intro">
          <h1 className="serif">
            {copy.introH[0]}<em>{copy.introH[1]}</em>{copy.introH[2]}
          </h1>
          <p>{copy.introP}</p>
        </div>
      </section>

      <section className="container">
        {/* Series card */}
        <div className="section-rule">
          <h2>{copy.seriesLabel}</h2>
          <span className="count">{lectureCount} / 12</span>
        </div>
        <Link href="/post/harness-engineering/" className="series-card" style={{ display: "grid" }}>
          <div>
            <div className="kicker">
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
              {" "}series · ongoing · 2026
            </div>
            <h3>{copy.seriesTitle}</h3>
            <p>{copy.seriesDesc}</p>
            <div className="meta-row">
              <span>{copy.seriesMeta}</span>
              <span className="sep" />
              <span>≈ 32 min</span>
              <span className="sep" />
              <span>en · vi</span>
            </div>
          </div>
          <div className="series-progress">
            <div>
              <div className="frac">
                <em>{String(lectureCount).padStart(2, "0")}</em>/{12}
              </div>
              <div className="label">lectures published</div>
            </div>
            <div className="ladder" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className={i < lectureCount ? "done" : ""} />
              ))}
            </div>
            <div className="label">{copy.seriesResume}</div>
          </div>
        </Link>

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
                <span className="post-date">{p.dateShort.m} {p.dateShort.d}</span>
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
                      <span className="tag" style={{ color: "var(--ink-mute)" }}>
                        draft
                      </span>
                    )}
                  </div>
                </div>
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
