---
title: "How to Contribute to This Blog (Guide for AI Agents)"
date: "2026-05-20"
tag: meta
diagram: code
readTime: 6
footnoteCount: 0
excerpt: "A complete reference for AI agents writing, editing, or managing posts on this blog. Covers file structure, frontmatter schema, Markdown conventions, and validation."
---

This post is a reference for AI agents (Claude, GPT, Gemini, or any coding agent) that need to create or edit content on this blog. Read it before writing any files.

## What This Blog Is

A Next.js static blog. Posts are plain Markdown files. There is no CMS, no database, no API to call. Content lives in the repository under `content/posts/`.

The full technical reference is in `docs/cli.md`. This post covers the practical workflow.

## File Structure

One file per post:

```
content/
  posts/
    <slug>.md
```

The filename (without `.md`) becomes the URL segment: `content/posts/why-agents-fail.md` → `/posts/why-agents-fail`.

Slugs are permanent. Choose carefully.

## Required Frontmatter

Every post must have all six fields. Missing any one will cause a build error.

```yaml
---
title: "Your Post Title"
date: "2026-05-20"
tag: harness-engineering
diagram: flow
readTime: 8
footnoteCount: 0
excerpt: "One to two sentences. Plain text only — no Markdown bold or asterisks."
---
```

### Field rules

**`title`** — The display title. Shown as the large heading on the post page and as the card title on the home feed. Use sentence case.

**`date`** — Must be `YYYY-MM-DD`. Controls sort order on the home feed (newest first) and the RSS feed publication date.

**`tag`** — A single string, no array. The home page left rail groups posts by tag. Existing tag: `harness-engineering`. Use `meta` for posts about the blog itself. Introduce new tags freely — they auto-appear in the filter.

**`diagram`** — One of four values. Pick the one that fits the post concept:
- `flow` — for processes, loops, sequences
- `mind` — for concepts and their relationships
- `code` — for implementation, technical content
- `graph` — for systems, networks, distributed topics

**`readTime`** — Integer. Estimated reading time in minutes. Count roughly 200 words per minute.

**`footnoteCount`** — Integer. Number of `[^1]` footnotes in the body. Set to `0` if none. This is displayed next to read time; it does not auto-count.

**`excerpt`** — Plain text, one or two sentences. Shown on the home feed and in the "Tóm tắt" (summary) box in the post sidebar. Do not use `**bold**` markers — write plain text.

## Writing the Body

Standard Markdown after the closing `---`:

```markdown
Opening paragraph. No heading before the first paragraph — jump straight into the text.

## First Section Heading

Body text. **Bold**, *italic*, `inline code` all work.

> Blockquotes render with a left border in italic muted text.

\`\`\`python
# Fenced code blocks render in monospace with horizontal scroll
def example():
    return True
\`\`\`

- Unordered list
- Another item

1. Ordered list
2. Another item
```

### Headings and the Table of Contents

Every `##` heading is automatically collected into the sidebar Table of Contents on the post page. No extra markup needed — IDs are injected at build time.

Use `##` for major sections and `###` for subsections. Do not use `#` (h1) — the post title already renders as h1.

### Vietnamese content

The blog is primarily in Vietnamese. Fonts are configured for full diacritic support:
- **Body text** — Lora (serif, `--font-serif`)
- **Headings** — Be Vietnam Pro (sans-serif, `--font-heading`)
- **Masthead** — DM Serif Display (Latin only, `--font-display`)
- **Mono / metadata** — JetBrains Mono (`--font-mono`)

Vietnamese diacritics render correctly at all sizes. No special handling needed.

## Creating a New Post — Step by Step

```bash
# 1. Create the file
cat > content/posts/my-new-post.md << 'EOF'
---
title: "My New Post"
date: "2026-05-20"
tag: harness-engineering
diagram: flow
readTime: 5
footnoteCount: 0
excerpt: "A short plain-text summary of this post."
---

Opening paragraph.

## First Section

Body content here.
EOF

# 2. Verify the build passes
npm run build

# 3. Check the result
# Home feed:  http://localhost:3000
# Post page:  http://localhost:3000/posts/my-new-post
```

## Editing an Existing Post

Read the file first to understand the current state, then apply targeted edits. Never rewrite the whole file if you are only changing one section.

```bash
# Check what posts exist
ls content/posts/

# Read a specific post
cat content/posts/lecture-01-why-capable-agents-still-fail.md
```

After editing, run `npm run build` to confirm no errors.

## Common Mistakes to Avoid

**Wrong `diagram` value** — only `flow`, `mind`, `code`, `graph` are valid. Any other value causes a TypeScript build error.

**Array syntax for `tag`** — `tag` is a string, not an array. Write `tag: essay`, not `tag: ["essay"]`.

**Markdown in `excerpt`** — the renderer strips `**bold**` but it is cleaner to write plain text from the start.

**Missing fields** — all six frontmatter fields are required. A post with a missing field will be silently skipped or cause a build error.

**Using `#` h1 in the body** — the post title already renders as h1. Start section headings at `##`.

**Non-ISO dates** — `date` must be `YYYY-MM-DD`. Other formats may parse incorrectly and break sort order.

## Where to Find More

- `docs/cli.md` — full technical reference: stack, schema, commands
- `docs/writing-a-post.md` — concise authoring guide with examples
- `src/lib/posts.ts` — how frontmatter is parsed and posts are loaded
- `src/app/posts/[slug]/page.tsx` — the post page component
- `src/components/home-stream.tsx` — the home feed component
