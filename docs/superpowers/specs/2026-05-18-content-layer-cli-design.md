# Content Layer + CLI Design

_2026-05-18 · Asa Blog_

## Goal

Replace all hardcoded TypeScript data (`src/data/*.ts`) with MDX files on disk. Add a Node.js CLI so agents (and humans) can scaffold and write posts without touching Next.js internals.

---

## Content Structure

```
content/
  posts/
    <slug>/
      index.mdx          # post metadata + body prose
      lectures/
        L1.mdx           # one file per lecture
        L2.mdx
        ...
      deck/
        slides.mdx       # all slides in one file, separated by ---
```

### `content/posts/<slug>/index.mdx` frontmatter

```yaml
---
title: "Harness Engineering — 12 lectures on agent control loops"
date: "2026-05-18"
tags: [essay, deck, reader]
readLabel: "32 min"
excerpt: "Reader & Notes, three spine diagrams..."
placeholder: false   # true = coming-soon, links disabled
---
Body prose here (rendered on /post/<slug>).
```

### `content/posts/<slug>/lectures/L<n>.mdx` frontmatter

```yaml
---
id: L1
num: "Lecture 01"
title: "The loop, defined"
lead: "Every harness is a closed loop."
r: "An agent harness is the scaffolding..."
note: "A harness without a verify step..."
notes: "Reader's first impression: a harness is plumbing..."
---
```

No body — all fields are structured. Body field reserved for future prose expansion.

### `content/posts/<slug>/deck/slides.yaml`

Slides are pure structured data — no prose body — so plain YAML is used instead of MDX:

```yaml
slides:
  - type: title
    heading: "Harness Engineering"
    sub: "12 lectures on agent control loops"
    meta: "Lecture series · 2026"
  - type: flow
    heading: "The Closed Loop"
    nodes: ["Observe", "Reason", "Act", "Verify", "Harness"]
    accent: 4
    caption: "Step 4 (Verify) is the return path."
  - type: bullets
    heading: "Verify — the cheap version"
    bullets:
      - "Check a named property"
      - "Not an opinion — a boolean"
      - "Dumb verifiers compound trust"
```

Supported slide types: `title`, `flow`, `bullets`, `boundary`, `quote`.

---

## Data Loading (`src/lib/content.ts`)

Replaces `src/data/posts.ts`, `src/data/lectures.ts`, `src/data/decks.ts`.

```ts
// All functions are async, read from `content/` at build time (Node.js fs).
// Results are plain objects matching the existing Post / Lecture / Slide types.

getPosts(): Promise<Post[]>
getPost(slug: string): Promise<Post & { body: string }>
getLectures(slug: string): Promise<Lecture[]>
getSlides(slug: string): Promise<Slide[]>
getPostSlugs(): Promise<string[]>  // for generateStaticParams
```

Dependencies added: `gray-matter` (parse frontmatter + YAML slides), `next-mdx-remote` (render MDX body prose server-side in App Router), `js-yaml` (parse `slides.yaml`).

All existing `Post`, `Lecture`, `Slide` TypeScript types stay identical — only the source changes from hardcoded arrays to parsed MDX.

---

## CLI (`scripts/asa.mjs`)

Single file, no dependencies beyond what's already in `package.json` (`gray-matter`). Added to `package.json` scripts as `"asa": "node scripts/asa.mjs"` so agents call `npm run asa -- <cmd>`.

### Commands

| Command | Effect |
|---|---|
| `new post <slug>` | Creates `content/posts/<slug>/index.mdx` with template frontmatter |
| `new lecture <slug> <id>` | Creates `content/posts/<slug>/lectures/<id>.mdx` with template frontmatter (id = L1..L12) |
| `new slide <slug>` | Appends a blank slide entry to `content/posts/<slug>/deck/slides.yaml` |
| `list` | Prints all posts with lecture count and placeholder status |
| `validate` | Checks all required frontmatter fields; exits non-zero on error |

### Output modes

- Default: human-readable text
- `--json`: machine-readable JSON (for agents parsing output)

### Error behaviour

- Missing required arg: prints usage + exits 1
- File already exists: prints warning, does NOT overwrite, exits 0
- Missing content dir: creates it

---

## Migration of existing hardcoded data

The existing `harness-engineering` post + 4 lectures are migrated to MDX files. The 3 placeholder posts are migrated as `placeholder: true` entries. `src/data/posts.ts`, `src/data/lectures.ts`, `src/data/decks.ts` are deleted after migration.

`src/data/search-index.ts` is replaced with a runtime function `buildSearchIndex(posts, lectures)` that constructs the search index from loaded content — no hardcoding.

---

## Out of scope

- CMS or database — filesystem only
- Post editing via CLI — agents edit MDX files directly
- Image handling — no images in this design system
- i18n of post content — only UI strings (hero copy, About) are bilingual
