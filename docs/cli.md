# asa's notes — Agent CLI Reference

This blog has no custom CLI. Content is plain Markdown files. The commands you need are `npm run dev`, `npm run build`, and your file editor.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router, React Server Components) |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Content | Markdown (`.md`) + gray-matter frontmatter |
| Markdown → HTML | remark + remark-html |
| Fonts | Lora (body), Be Vietnam Pro (headings), DM Serif Display (masthead), JetBrains Mono (mono) |

---

## Content directory

```
content/
  posts/
    <slug>.md       ← one file per post, slug = URL segment
```

URL pattern: `/posts/<slug>`

---

## Post frontmatter schema

```yaml
---
title: "Your post title"
date: "2026-05-20"          # YYYY-MM-DD
tag: harness-engineering    # single tag string
diagram: flow               # flow | mind | code | graph
readTime: 8                 # integer, minutes
footnoteCount: 0            # integer
excerpt: "One or two sentences shown on the home page and in the sidebar."
---
```

### Field reference

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Shown as h1 on post page and h2 on home feed |
| `date` | `YYYY-MM-DD` | yes | Used for sorting and RSS |
| `tag` | string | yes | Single tag; appears in filter sidebar on home |
| `diagram` | `flow\|mind\|code\|graph` | yes | SVG thumbnail on home and full diagram on post page |
| `readTime` | integer | yes | Minutes; displayed as "N min read" |
| `footnoteCount` | integer | yes | Shown next to read time if > 0 |
| `excerpt` | string | yes | Shown on home feed and in post sidebar ("Tóm tắt"); strip markdown bold (`**`) — the renderer strips it but cleaner without |

---

## Dev commands

```bash
npm run dev      # start dev server at http://localhost:3000 (Turbopack, hot reload)
npm run build    # production build — runs generateStaticParams for all posts
```

---

## Creating a post

1. Create `content/posts/<slug>.md` with valid frontmatter (all fields required).
2. Write body in Markdown below the `---` closing delimiter.
3. Save — hot reload shows the post immediately on the home feed.
4. Verify at `http://localhost:3000/posts/<slug>`.

```bash
# Minimal working example
cat > content/posts/my-new-post.md << 'EOF'
---
title: "My New Post"
date: "2026-05-20"
tag: essay
diagram: flow
readTime: 5
footnoteCount: 0
excerpt: "A short summary of what this post is about."
---

Body text starts here.
EOF
```

---

## Markdown features

| Element | Rendered as |
|---|---|
| `## Heading` | Section heading (Be Vietnam Pro, 1.3rem, underline rule) |
| `### Subheading` | Smaller section heading |
| `**bold**` | Bold |
| `*italic*` | Italic |
| `> blockquote` | Left-bordered italic quote |
| `` `code` `` | Inline monospace |
| ` ```code block``` ` | Fenced code block with horizontal scroll |
| `- item` | Unordered list |
| `1. item` | Ordered list |

---

## Table of contents

The post page auto-generates a TOC in the sidebar from all `## h2` headings in the post body. No special markup needed — IDs are injected automatically at build time.

---

## RSS feed

Auto-generated at `/rss.xml`. All published posts are included. No action needed.

---

## Themes

Four colour themes available via the toggle in the header: warm, pure, newsprint (default), dark. All use CSS custom properties (`--paper`, `--ink`, `--muted`, `--rule`).

---

## Validation checklist before committing

- [ ] All frontmatter fields present and correct type
- [ ] `date` is `YYYY-MM-DD`
- [ ] `diagram` is one of: `flow`, `mind`, `code`, `graph`
- [ ] `npm run build` exits 0
- [ ] Post appears at `http://localhost:3000/posts/<slug>`
- [ ] TOC renders correctly in the sidebar
