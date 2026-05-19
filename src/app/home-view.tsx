"use client";

import Link from "next/link";
import type { Post } from "@/lib/content";
import { useLang } from "@/context/lang-context";

const EN_COPY = {
  introH: ["Field notes on quiet, ", "verifiable", " software."],
  introP: "A small journal — short essays on agent harnesses, control loops, and what stays after the demo ends.",
};

const VI_COPY = {
  introH: ["Ghi chép về phần mềm yên tĩnh, ", "có thể kiểm chứng", "."],
  introP: "Nhật ký nhỏ — bài ngắn về agent harness, vòng điều khiển, và những gì còn lại sau khi demo kết thúc.",
};

// lectureCount kept in Props so page.tsx does not need changes
type Props = { posts: Post[]; lectureCount: number };

export default function HomeView({ posts }: Props) {
  const { lang } = useLang();
  const copy = lang === "vi" ? VI_COPY : EN_COPY;

  const navigablePosts = posts.filter((p) => !p.placeholder);

  return (
    <main>
      <section className="intro">
        <h1>
          {copy.introH[0]}
          <em>{copy.introH[1]}</em>
          {copy.introH[2]}
        </h1>
        <p>{copy.introP}</p>
      </section>

      <ul className="list">
        {navigablePosts.map((p) => (
          // display:contents makes the Link fill the grid cell defined by the <li>
          // while preserving full keyboard nav, prefetch, and right-click semantics
          <li key={p.slug}>
            <Link href={`/post/${p.slug}/`} style={{ display: "contents" }}>
              <span className="date">
                {p.dateShort.m} {p.dateShort.d}
              </span>
              <div>
                <p className="title">{p.title}</p>
                <p className="excerpt">{p.excerpt}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
