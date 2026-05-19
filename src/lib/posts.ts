import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type { DiagramKind } from "@/components/diagram";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;        // "May 14, 2026"
  dateISO: string;     // "2026-05-14" for sorting + RSS
  tag: string;
  diagram: DiagramKind;
  readTime: number;    // minutes
  footnoteCount: number;
  excerpt: string;
}

export interface Heading {
  id: string;
  text: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
  headings: Heading[];
}

function parseDate(raw: string): string {
  // Accepts "May 14, 2026" or ISO "2026-05-14"
  const d = new Date(raw);
  return isNaN(d.getTime()) ? raw : d.toISOString().split("T")[0];
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPosts(): PostMeta[] {
  const slugs = getAllPostSlugs();
  return slugs
    .map((slug) => getPostMeta(slug))
    .filter(Boolean)
    .sort((a, b) => (a!.dateISO > b!.dateISO ? -1 : 1)) as PostMeta[];
}

export function getPostMeta(slug: string): PostMeta | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);

  const dateISO = parseDate(String(data.date ?? ""));
  const date = data.date
    ? formatDate(dateISO)
    : dateISO;

  return {
    slug,
    title: String(data.title ?? slug),
    date,
    dateISO,
    tag: String(data.tag ?? "misc"),
    diagram: (data.diagram as DiagramKind) ?? "flow",
    readTime: Number(data.readTime ?? 5),
    footnoteCount: Number(data.footnoteCount ?? 0),
    excerpt: String(data.excerpt ?? ""),
  };
}

export async function getPost(slug: string): Promise<Post | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);

  const processed = await remark().use(remarkHtml).process(content);
  const rawHtml = processed.toString();

  // Inject IDs into h2 headings and collect TOC
  const headings: Heading[] = [];
  let sectionCount = 0;
  const contentHtml = rawHtml.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner) => {
    const id = `section-${++sectionCount}`;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    headings.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });

  const meta = getPostMeta(slug);
  if (!meta) return null;

  return { ...meta, contentHtml, headings };
}

// Aggregate tag counts across all posts.
export function getTagCounts(): [string, number][] {
  const counts: Record<string, number> = {};
  for (const post of getAllPosts()) {
    counts[post.tag] = (counts[post.tag] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

// Aggregate year counts across all posts.
export function getYearCounts(): [string, number][] {
  const counts: Record<string, number> = {};
  for (const post of getAllPosts()) {
    const year = post.dateISO.slice(0, 4);
    counts[year] = (counts[year] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[0].localeCompare(a[0]));
}
