"use client";

import Link from "next/link";
import { useLang } from "@/context/lang-context";
import type { Lecture } from "@/lib/content";

type Props = { slug: string; lectures: Lecture[] };

type Block =
  | { kind: "heading"; text: string }
  | { kind: "blockquote"; text: string }
  | { kind: "bullets"; items: string[] }
  | { kind: "paragraph"; text: string };

/**
 * Parses double-newline-separated text into typed blocks.
 * Consecutive "- " paragraphs are merged into a single bullet block
 * so they render as one <ul> rather than many single-item lists.
 */
function parseBlocks(text: string): Block[] {
  const paragraphs = text.split("\n\n").filter((p) => p.trim());
  const blocks: Block[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();

    if (trimmed.startsWith("## ")) {
      blocks.push({ kind: "heading", text: trimmed.replace(/^## /, "") });
      continue;
    }

    if (trimmed.startsWith("> ")) {
      blocks.push({ kind: "blockquote", text: trimmed.replace(/^> /, "") });
      continue;
    }

    // A paragraph can itself be multiple "- " lines (joined by \n in scraper)
    const lines = trimmed.split("\n");
    const isBulletBlock = lines.every((l) => l.startsWith("- "));
    if (isBulletBlock) {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "bullets") {
        // Merge consecutive bullet paragraphs into same list
        last.items.push(...lines.map((l) => l.replace(/^- /, "")));
      } else {
        blocks.push({ kind: "bullets", items: lines.map((l) => l.replace(/^- /, "")) });
      }
      continue;
    }

    blocks.push({ kind: "paragraph", text: trimmed });
  }

  return blocks;
}

function LectureSection({ lecture, lang }: { lecture: Lecture; lang: string }) {
  const title = lang === "vi" ? lecture.title_vi || lecture.title_en : lecture.title_en;
  const lead  = lang === "vi" ? lecture.lead_vi  || lecture.lead_en  : lecture.lead_en;
  const body  = lang === "vi" ? lecture.full_vi  || lecture.full_en  : lecture.full_en;

  const blocks = parseBlocks(body);

  return (
    <section id={lecture.id} className="full-lec">
      <div className="lec-meta">{lecture.num}</div>
      <h2>{title}</h2>
      <p className="lead">{lead}</p>
      <div className="body">
        {blocks.map((block, i) => {
          switch (block.kind) {
            case "heading":
              return <h3 key={i}>{block.text}</h3>;
            case "blockquote":
              return <blockquote key={i}>{block.text}</blockquote>;
            case "bullets":
              return (
                <ul key={i}>
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            case "paragraph":
              return <p key={i}>{block.text}</p>;
          }
        })}
      </div>
    </section>
  );
}

export default function FullView({ slug, lectures }: Props) {
  const { lang } = useLang();

  return (
    <main>
      <Link className="back" href={`/post/${slug}/`}>← harness engineering</Link>

      <header className="post-head">
        <div className="meta">full transcript · all lectures</div>
        <h1>Harness Engineering — Full Text</h1>
        <p className="lede">
          The unbroken transcript. Use this when you remember a phrase and need
          to find its lecture.
        </p>
      </header>

      {lectures.map((l) => (
        <LectureSection key={l.id} lecture={l} lang={lang} />
      ))}

      <div className="reader-actions">
        <Link href={`/post/${slug}/`}>← back to post</Link>
        <Link href={`/reader/${slug}/`}>reader &amp; notes →</Link>
      </div>
    </main>
  );
}
