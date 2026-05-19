"use client";

import Link from "next/link";
import { useState } from "react";
import { Diagram } from "@/components/diagram";
import { ThemeToggle } from "@/components/theme-toggle";
import type { PostMeta } from "@/lib/posts";

interface HomeStreamProps {
  posts: PostMeta[];
  tagCounts: [string, number][];
  yearCounts: [string, number][];
}

function stripMd(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/__(.*?)__/g, "$1").replace(/_(.*?)_/g, "$1");
}

// Thin horizontal rule.
function Hairline() {
  return (
    <div
      style={{
        height: 0,
        borderTop: "1px solid var(--rule)",
        width: "100%",
      }}
    />
  );
}

// Monospace all-caps section label.
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--muted)",
      }}
    >
      {children}
    </div>
  );
}

export function HomeStream({ posts, tagCounts, yearCounts }: HomeStreamProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.tag.toLowerCase().includes(query.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-serif)",
        padding: "40px 56px",
        boxSizing: "border-box",
      }}
    >
      {/* ── Masthead ──────────────────────────────────────── */}
      <header
        style={{
          textAlign: "center",
          paddingBottom: 14,
          marginBottom: 22,
          borderBottom: "2px solid var(--ink)",
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 56,
            lineHeight: 1,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
          }}
        >
          asa&rsquo;s notes
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 15,
            color: "var(--muted)",
          }}
        >
          A quiet record of things learned, kept honest by writing them down.
        </div>
        {/* Vol. / date — bottom left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 14,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Vol. III · May 2026
        </div>
        {/* Issue number + theme toggle — bottom right */}
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            n.º {posts.length}
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Three-column body ─────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr 240px",
          gap: 52,
        }}
      >
        {/* ── Left rail ──────────────────────────────────── */}
        <aside>
          {/* Search */}
          <div className="search-field">
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <circle cx="10" cy="10" r="6" />
              <path d="M15 15 L20 20" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search"
              aria-label="Search posts"
            />
          </div>

          {/* Topics */}
          <div style={{ marginTop: 28 }}>
            <Eyebrow>Topics</Eyebrow>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontFamily: "var(--font-heading)",
                fontSize: 14,
              }}
            >
              {tagCounts.map(([tag, count], i) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag === query ? "" : tag)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: tag === query ? 700 : i === 0 ? 600 : 400,
                    fontFamily: "var(--font-heading)",
                    fontSize: 14,
                    color: "var(--ink)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <span>{tag}</span>
                  <span
                    style={{
                      color: "var(--muted)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                    }}
                  >
                    {String(count).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Archive */}
          <div style={{ marginTop: 32 }}>
            <Eyebrow>Archive</Eyebrow>
            <div
              style={{
                marginTop: 10,
                fontFamily: "var(--font-serif)",
                fontSize: 15,
                color: "var(--ink)",
                lineHeight: 1.9,
              }}
            >
              {yearCounts.map(([year, count]) => (
                <div
                  key={year}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{year}</span>
                  <span
                    style={{
                      color: "var(--muted)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                    }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Centre stream ──────────────────────────────── */}
        <main>
          {filtered.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                color: "var(--muted)",
                paddingTop: 16,
              }}
            >
              No posts match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            filtered.map((post, i) => (
              <article
                key={post.slug}
                style={{
                  paddingBottom: 22,
                  marginBottom: 22,
                  borderBottom:
                    i < filtered.length - 1
                      ? "1px solid var(--rule)"
                      : "none",
                }}
              >
                <Link
                  href={`/posts/${post.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ display: "flex", gap: 28 }}>
                    {/* text */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "var(--muted)",
                          }}
                        >
                          {post.date}
                        </span>
                        <span style={{ color: "var(--muted)" }}>·</span>
                        <span
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--muted)",
                          }}
                        >
                          {post.tag}
                        </span>
                      </div>

                      <h2
                        style={{
                          margin: 0,
                          fontFamily: "var(--font-heading)",
                          fontSize: i === 0 ? 28 : 22,
                          lineHeight: 1.3,
                          letterSpacing: "-0.01em",
                          color: "var(--ink)",
                          fontWeight: 700,
                        }}
                      >
                        {post.title}
                      </h2>

                      <p
                        style={{
                          margin: "10px 0 0",
                          fontFamily: "var(--font-serif)",
                          fontSize: 15.5,
                          lineHeight: 1.85,
                          color: "var(--ink)",
                          maxWidth: 560,
                        }}
                      >
                        {stripMd(post.excerpt)}
                      </p>

                      <div
                        style={{
                          marginTop: 10,
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          letterSpacing: "0.1em",
                          color: "var(--muted)",
                          textTransform: "uppercase",
                        }}
                      >
                        {post.readTime} min ·{" "}
                        {post.footnoteCount > 0
                          ? `${post.footnoteCount} footnote${post.footnoteCount > 1 ? "s" : ""} · `
                          : ""}
                        read →
                      </div>
                    </div>

                    {/* diagram thumbnail */}
                    <div
                      style={{
                        flex: "0 0 120px",
                        display: "flex",
                        alignItems: "flex-start",
                        paddingTop: 14,
                      }}
                    >
                      <Diagram kind={post.diagram} size={120} />
                    </div>
                  </div>
                </Link>
              </article>
            ))
          )}
        </main>

        {/* ── Right margin ───────────────────────────────── */}
        <aside
          style={{
            borderLeft: "1px solid var(--rule)",
            paddingLeft: 24,
          }}
        >
          <Eyebrow>Currently</Eyebrow>
          <p
            style={{
              margin: "8px 0 0",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 15,
              color: "var(--ink)",
              lineHeight: 1.55,
            }}
          >
            Re-reading the Raft paper. Tinkering with the sqlite vfs layer. A
            slow week — mostly long walks.
          </p>

          <div style={{ marginTop: 28 }}>
            <Eyebrow>Footnotes</Eyebrow>
            <ol
              style={{
                margin: "10px 0 0",
                padding: "0 0 0 20px",
                fontFamily: "var(--font-serif)",
                fontSize: 13,
                color: "var(--ink)",
                lineHeight: 1.6,
              }}
            >
              <li>The bound is amortized, not worst-case.</li>
              <li style={{ marginTop: 6 }}>See Ousterhout &rsquo;19, §3.</li>
              <li style={{ marginTop: 6 }}>POSIX is, ahem, a lot.</li>
            </ol>
          </div>

          <div style={{ marginTop: 28 }}>
            <Eyebrow>Subscribe</Eyebrow>
            <div
              style={{
                marginTop: 10,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--ink)",
                lineHeight: 2,
                letterSpacing: "0.04em",
              }}
            >
              <a
                href="/rss.xml"
                style={{ display: "block", color: "inherit" }}
              >
                → rss
              </a>
              <a
                href="/rss.xml"
                style={{ display: "block", color: "inherit" }}
              >
                → atom
              </a>
              <a
                href="/rss.xml"
                style={{ display: "block", color: "inherit" }}
              >
                → json feed
              </a>
              <a
                href="/rss.xml"
                style={{ display: "block", color: "inherit" }}
              >
                → markdown
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
