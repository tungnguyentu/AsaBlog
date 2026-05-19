import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPost, getAllPostSlugs } from "@/lib/posts";
import { Diagram } from "@/components/diagram";
import { ThemeToggle } from "@/components/theme-toggle";

function stripMd(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/__(.*?)__/g, "$1").replace(/_(.*?)_/g, "$1");
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — asa's notes`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-serif)",
        padding: "32px 56px",
        boxSizing: "border-box",
      }}
    >
      {/* ── Mini header ──────────────────────────────────── */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingBottom: 12,
          borderBottom: "1px solid var(--rule)",
          marginBottom: 48,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            letterSpacing: "-0.005em",
            color: "var(--ink)",
            textDecoration: "none",
          }}
        >
          asa&rsquo;s notes
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              textDecoration: "none",
            }}
          >
            ← index
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Two-column: article + margin ─────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 220px",
          gap: 56,
          alignItems: "start",
        }}
      >
        {/* ── Article ────────────────────────────────────── */}
        <article style={{ maxWidth: 720 }}>
          {/* eyebrow */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            {post.tag} · {post.date}
          </div>

          {/* headline */}
          <h1
            style={{
              margin: "0 0 20px",
              fontFamily: "var(--font-heading)",
              fontSize: 36,
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
              fontWeight: 700,
            }}
          >
            {post.title}
          </h1>

          {/* meta */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 32,
              paddingBottom: 32,
              borderBottom: "1px solid var(--rule)",
            }}
          >
            {post.readTime} min read
            {post.footnoteCount > 0
              ? ` · ${post.footnoteCount} footnote${post.footnoteCount > 1 ? "s" : ""}`
              : ""}
          </div>

          {/* diagram */}
          <div style={{ marginBottom: 36 }}>
            <Diagram kind={post.diagram} size={200} />
          </div>

          {/* body */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        {/* ── Sidebar: TOC + meta ────────────────────────── */}
        <aside
          style={{
            position: "sticky",
            top: 32,
            borderLeft: "1px solid var(--rule)",
            paddingLeft: 24,
          }}
        >
          {/* Excerpt */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 10,
            }}
          >
            Tóm tắt
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 13,
              color: "var(--ink)",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            {stripMd(post.excerpt)}
          </div>

          {/* Table of contents */}
          {post.headings.length > 0 && (
            <>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: 10,
                }}
              >
                Mục lục
              </div>
              <nav>
                <ol
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {post.headings.map((h, i) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        style={{
                          display: "flex",
                          gap: 8,
                          fontFamily: "var(--font-heading)",
                          fontSize: 12.5,
                          lineHeight: 1.4,
                          color: "var(--muted)",
                          textDecoration: "none",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--muted)",
                            opacity: 0.6,
                            flexShrink: 0,
                            paddingTop: 2,
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{h.text}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </>
          )}

          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid var(--rule)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted)",
              lineHeight: 2,
            }}
          >
            <a href="/rss.xml" style={{ display: "block", color: "inherit" }}>
              → rss feed
            </a>
            <Link href="/" style={{ display: "block", color: "inherit" }}>
              → all notes
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
