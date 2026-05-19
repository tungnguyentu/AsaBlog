"use client";

import Link from "next/link";
import { useLang } from "@/context/lang-context";

const EN = {
  meta: "about · est. 2024",
  h1: "A small journal, written slowly.",
  lead: "Asa is a small journal about quiet, observable, stubbornly verifiable software — kept by one person, updated when there's something worth writing down.",
  p1: "Most entries are short. The longer ones come paired with a Reader & Notes view and a minimal slide deck, so the same idea can be skimmed, studied, or spoken from.",
  p2: "The site is plain Next.js, statically exported, served by Nginx. No analytics, no comments, no popups. Email is the back channel.",
  label1: "what's here",
  pane1: "Essays on agent harnesses, control loops, and the small choices that decide whether software keeps working.",
  label2: "colophon",
  pane2: "Set in Source Serif 4 for body, JetBrains Mono for metadata. Single terracotta accent. No images, by choice.",
};

const VI = {
  meta: "giới thiệu · est. 2024",
  h1: "Sổ tay nhỏ, viết chậm.",
  lead: "Asa là sổ tay nhỏ về phần mềm — yên tĩnh, quan sát được, và bướng bỉnh dễ kiểm chứng. Một người viết, cập nhật khi có gì đáng ghi lại.",
  p1: "Phần lớn ngắn. Bài dài đi kèm bản Reader & Notes và slide deck tối giản, để cùng một ý có thể đọc lướt, học kỹ, hoặc trình bày.",
  p2: "Trang chạy Next.js export tĩnh, Nginx phục vụ. Không analytics, không comment, không popup. Email là kênh phản hồi.",
  label1: "nội dung",
  pane1: "Ghi chép về agent harness, vòng điều khiển, và những lựa chọn nhỏ quyết định phần mềm có tiếp tục chạy hay không.",
  label2: "colophon",
  pane2: "Source Serif 4 cho thân chữ, JetBrains Mono cho metadata. Một sắc đất nung duy nhất. Không hình minh hoạ — theo chủ ý.",
};

export default function AboutPage() {
  const { lang } = useLang();
  const c = lang === "vi" ? VI : EN;

  return (
    <main>
      <Link className="back" href="/">← writing</Link>

      <header className="post-head">
        <div className="meta">{c.meta}</div>
        <h1>{c.h1}</h1>
      </header>

      <article className="body">
        <p className="lead">{c.lead}</p>
        <p>{c.p1}</p>
        <p>{c.p2}</p>

        <div className="about-card">
          <div className="pane">
            <div className="label">{c.label1}</div>
            <p>{c.pane1}</p>
          </div>
          <div className="pane">
            <div className="label">{c.label2}</div>
            <p>{c.pane2}</p>
          </div>
        </div>
      </article>
    </main>
  );
}
