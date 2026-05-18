#!/usr/bin/env node
// scripts/asa.mjs — CLI for authoring Asa Blog content
// Usage: node scripts/asa.mjs <command> [args] [--json]

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "content");

const isJson = process.argv.includes("--json");
const args = process.argv.slice(2).filter((a) => a !== "--json");

function out(data) {
  if (isJson) console.log(JSON.stringify(data, null, 2));
  else if (typeof data === "string") console.log(data);
  else console.log(JSON.stringify(data, null, 2));
}

function err(msg, code = 1) {
  if (isJson) console.error(JSON.stringify({ error: msg }));
  else console.error("error:", msg);
  process.exit(code);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeIfAbsent(filePath, content) {
  if (fs.existsSync(filePath)) {
    if (!isJson) console.log(`exists: ${filePath}`);
    return { created: false, path: filePath };
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
  if (!isJson) console.log(`created: ${filePath}`);
  return { created: true, path: filePath };
}

// -- commands --

function cmdNewPost(slug) {
  if (!slug) err("usage: new post <slug>");
  const filePath = path.join(CONTENT, "posts", slug, "index.mdx");
  const today = new Date().toISOString().slice(0, 10);
  writeIfAbsent(
    filePath,
    `---\ntitle: "${slug}"\ndate: "${today}"\ntags: []\nreadLabel: "5 min"\nexcerpt: ""\nplaceholder: false\n---\n\n`
  );
}

function cmdNewLecture(slug, id) {
  if (!slug || !id) err("usage: new lecture <slug> <id>  (e.g. L1)");
  const filePath = path.join(CONTENT, "posts", slug, "lectures", `${id}.mdx`);
  const n = id.replace("L", "").padStart(2, "0");
  writeIfAbsent(
    filePath,
    `---\nid: "${id}"\nnum: "Lecture ${n}"\ntitle: ""\nlead: ""\nr: ""\nnote: ""\nnotes: ""\n---\n`
  );
}

function cmdNewSlide(slug) {
  if (!slug) err("usage: new slide <slug>");
  const slidesPath = path.join(CONTENT, "posts", slug, "deck", "slides.yaml");
  ensureDir(path.dirname(slidesPath));
  const entry = `  - type: bullets\n    n: "new slide"\n    heading: ""\n    bullets: []\n    foot: ["", ""]\n`;
  if (!fs.existsSync(slidesPath)) {
    fs.writeFileSync(slidesPath, `slides:\n${entry}`, "utf8");
    if (!isJson) console.log(`created: ${slidesPath}`);
  } else {
    fs.appendFileSync(slidesPath, entry, "utf8");
    if (!isJson) console.log(`appended slide to: ${slidesPath}`);
  }
}

function cmdList() {
  const postsDir = path.join(CONTENT, "posts");
  if (!fs.existsSync(postsDir)) {
    out("no posts found");
    return;
  }
  const slugs = fs
    .readdirSync(postsDir)
    .filter((d) => fs.statSync(path.join(postsDir, d)).isDirectory());

  const results = slugs.map((slug) => {
    const mdxPath = path.join(postsDir, slug, "index.mdx");
    let title = slug;
    let placeholder = false;
    if (fs.existsSync(mdxPath)) {
      const raw = fs.readFileSync(mdxPath, "utf8");
      const m = raw.match(/title:\s*"([^"]+)"/);
      if (m) title = m[1];
      placeholder = raw.includes("placeholder: true");
    }
    const lecturesDir = path.join(postsDir, slug, "lectures");
    const lectureCount = fs.existsSync(lecturesDir)
      ? fs.readdirSync(lecturesDir).filter((f) => f.endsWith(".mdx")).length
      : 0;
    return { slug, title, placeholder, lectureCount };
  });

  if (isJson) {
    out(results);
  } else {
    results.forEach((r) =>
      console.log(
        `${r.placeholder ? "[draft]" : "[live] "} ${r.slug} (${r.lectureCount} lectures) — ${r.title}`
      )
    );
  }
}

function cmdValidate() {
  const postsDir = path.join(CONTENT, "posts");
  if (!fs.existsSync(postsDir)) {
    out("no content found");
    return;
  }
  const errors = [];
  const REQUIRED_POST = ["title", "date", "tags", "readLabel", "excerpt"];
  const REQUIRED_LECTURE = ["id", "num", "title", "lead", "r", "note", "notes"];

  const slugs = fs
    .readdirSync(postsDir)
    .filter((d) => fs.statSync(path.join(postsDir, d)).isDirectory());

  for (const slug of slugs) {
    const mdxPath = path.join(postsDir, slug, "index.mdx");
    if (!fs.existsSync(mdxPath)) {
      errors.push(`${slug}: missing index.mdx`);
      continue;
    }
    const raw = fs.readFileSync(mdxPath, "utf8");
    for (const field of REQUIRED_POST) {
      if (!raw.includes(`${field}:`))
        errors.push(`${slug}/index.mdx: missing field "${field}"`);
    }
    const lecturesDir = path.join(postsDir, slug, "lectures");
    if (fs.existsSync(lecturesDir)) {
      for (const f of fs
        .readdirSync(lecturesDir)
        .filter((f) => f.endsWith(".mdx"))) {
        const lRaw = fs.readFileSync(path.join(lecturesDir, f), "utf8");
        for (const field of REQUIRED_LECTURE) {
          if (!lRaw.includes(`${field}:`))
            errors.push(`${slug}/lectures/${f}: missing field "${field}"`);
        }
      }
    }
  }

  if (errors.length === 0) {
    if (isJson) out({ valid: true });
    else console.log("all content valid");
  } else {
    if (isJson) out({ valid: false, errors });
    else errors.forEach((e) => console.error("  x", e));
    process.exit(1);
  }
}

// -- dispatch --

const [cmd, sub, ...rest] = args;

if (cmd === "new") {
  if (sub === "post") cmdNewPost(rest[0]);
  else if (sub === "lecture") cmdNewLecture(rest[0], rest[1]);
  else if (sub === "slide") cmdNewSlide(rest[0]);
  else err(`unknown subcommand: new ${sub}\nusage: new post|lecture|slide`);
} else if (cmd === "list") {
  cmdList();
} else if (cmd === "validate") {
  cmdValidate();
} else {
  console.log(`asa — content cli
  new post <slug>           scaffold a new post
  new lecture <slug> <id>   add a lecture (e.g. L1..L12)
  new slide <slug>          append a blank slide
  list                      list all posts
  validate                  check required frontmatter fields
  --json                    machine-readable output`);
}
