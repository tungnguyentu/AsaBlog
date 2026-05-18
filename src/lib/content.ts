import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Post = {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  dateShort: { d: string; m: string };
  excerpt: string;
  tags: string[];
  readLabel: string;
  placeholder: boolean;
};

export type PostWithBody = Post & { body: string };

export type Lecture = {
  id: string;
  num: string;
  title: string;
  lead: string;
  r: string;
  note: string;
  notes: string;
};

export type DeckSlide = {
  n: string;
  type: string;
  [key: string]: unknown;
};

export type Deck = {
  slug: string;
  title: string;
  meta: string;
  miniT: string;
  miniMeta: string;
  placeholder: boolean;
  postSlug?: string;
};

export type SearchItem = {
  kind: "post" | "lecture" | "page";
  icon: string;
  title: string;
  sub: string;
  meta: string;
  href: string;
  haystack: string;
};

// -- date helpers --

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")} · ${d.getFullYear()}`;
}

function formatDateShort(dateStr: string): { d: string; m: string } {
  const d = new Date(dateStr + "T00:00:00");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return { d: String(d.getDate()).padStart(2, "0"), m: months[d.getMonth()] };
}

// -- posts --

export function getPostSlugs(): string[] {
  const postsDir = path.join(CONTENT_DIR, "posts");
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir).filter((d) =>
    fs.statSync(path.join(postsDir, d)).isDirectory()
  );
}

export function getPost(slug: string): PostWithBody {
  const filePath = path.join(CONTENT_DIR, "posts", slug, "index.mdx");
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    dateLabel: formatDateLabel(data.date as string),
    dateShort: formatDateShort(data.date as string),
    excerpt: data.excerpt as string,
    tags: (data.tags as string[]) ?? [],
    readLabel: data.readLabel as string,
    placeholder: (data.placeholder as boolean) ?? false,
    body: content.trim(),
  };
}

export function getPosts(): Post[] {
  return getPostSlugs()
    .map(getPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// -- lectures --

export function getLectures(postSlug: string): Lecture[] {
  const lecturesDir = path.join(CONTENT_DIR, "posts", postSlug, "lectures");
  if (!fs.existsSync(lecturesDir)) return [];
  return fs
    .readdirSync(lecturesDir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((f) => {
      const raw = fs.readFileSync(path.join(lecturesDir, f), "utf8");
      const { data } = matter(raw);
      return data as Lecture;
    });
}

// -- deck slides --

export function getSlides(postSlug: string): DeckSlide[] {
  const slidesPath = path.join(CONTENT_DIR, "posts", postSlug, "deck", "slides.yaml");
  if (!fs.existsSync(slidesPath)) return [];
  const raw = fs.readFileSync(slidesPath, "utf8");
  const data = yaml.load(raw) as { slides: DeckSlide[] };
  return data.slides ?? [];
}

// -- decks --

export function getDecks(): Deck[] {
  const decksDir = path.join(CONTENT_DIR, "decks");
  if (!fs.existsSync(decksDir)) return [];
  return fs
    .readdirSync(decksDir)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(decksDir, f), "utf8");
      return yaml.load(raw) as Deck;
    });
}

// -- search index --

export function buildSearchIndex(posts: Post[], lectures: Lecture[]): SearchItem[] {
  const idx: SearchItem[] = [];

  posts.forEach((p) => {
    idx.push({
      kind: "post",
      icon: "¶",
      title: p.title,
      sub: p.excerpt,
      meta: p.dateLabel,
      href: p.placeholder ? "" : `/post/${p.slug}/`,
      haystack: [p.title, p.excerpt, ...p.tags].join(" ").toLowerCase(),
    });
  });

  lectures.forEach((l) => {
    idx.push({
      kind: "lecture",
      icon: l.id,
      title: l.title,
      sub: l.lead,
      meta: l.num.toLowerCase(),
      href: `/reader/harness-engineering/#${l.id}`,
      haystack: [l.title, l.lead, l.r, l.note, l.notes].join(" ").toLowerCase(),
    });
  });

  const pages = [
    { title: "Writing",             sub: "All essays, notes and decks.",        icon: "¶", href: "/" },
    { title: "Reader · R&N",        sub: "Twelve lectures with margin notes.",  icon: "R", href: "/reader/harness-engineering/" },
    { title: "Harness Engineering", sub: "Essay overview with spine diagrams.", icon: "H", href: "/post/harness-engineering/" },
  ];

  pages.forEach((pg) => {
    idx.push({
      kind: "page",
      icon: pg.icon,
      title: pg.title,
      sub: pg.sub,
      meta: "jump",
      href: pg.href,
      haystack: (pg.title + " " + pg.sub).toLowerCase(),
    });
  });

  return idx;
}

export const SEARCH_RECENTS = [
  "verify step",
  "visibility boundary",
  "state machine",
  "deck",
];
