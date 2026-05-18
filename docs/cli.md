# asa CLI

Content authoring tool for Asa Blog. Scaffolds and validates MDX/YAML files under `content/`.

```bash
npm run asa -- <command> [args] [--json]
```

---

## Commands

### `new post <slug>`

Scaffold a new post directory with a template `index.mdx`.

```bash
npm run asa -- new post my-post-slug
# created: content/posts/my-post-slug/index.mdx
```

Generated file:

```
---
title: "my-post-slug"
date: "2026-05-18"
tags: []
readLabel: "5 min"
excerpt: ""
placeholder: false
---
```

**Fields to fill in:**

| Field | Description |
|---|---|
| `title` | Display title shown on home and post pages |
| `date` | Publication date — `YYYY-MM-DD` |
| `tags` | Array of strings, e.g. `["essay", "reader"]` |
| `readLabel` | Estimated read time, e.g. `"12 min"` |
| `excerpt` | One-sentence summary shown in the post list |
| `placeholder` | `true` = draft, links disabled on home page |

> Will not overwrite if the file already exists.

---

### `new lecture <slug> <id>`

Add a lecture file to an existing post. `id` is `L1`–`L12`.

```bash
npm run asa -- new lecture my-post-slug L1
# created: content/posts/my-post-slug/lectures/L1.mdx
```

Generated file:

```
---
id: "L1"
num: "Lecture 01"
title: ""
lead: ""
r: ""
note: ""
notes: ""
---
```

**Fields:**

| Field | Description |
|---|---|
| `id` | Anchor ID used in the Reader URL fragment (`#L1`) |
| `num` | Label shown in the TOC, e.g. `"Lecture 01"` |
| `title` | Lecture heading |
| `lead` | One-line thesis shown as the section kicker |
| `r` | Reader paragraph — main body text for this lecture |
| `note` | Margin note (right column in Reader) |
| `notes` | Meta-note — context for the reader's first impression |

> Will not overwrite if the file already exists.

---

### `new slide <slug>`

Append a blank slide entry to `content/posts/<slug>/deck/slides.yaml`. Creates the file if it doesn't exist.

```bash
npm run asa -- new slide my-post-slug
# appended slide to: content/posts/my-post-slug/deck/slides.yaml
```

Appended entry:

```yaml
- type: bullets
  n: "new slide"
  heading: ""
  bullets: []
  foot: ["", ""]
```

**Slide types and their fields:**

| Type | Extra fields |
|---|---|
| `title` | `heading`, `sub`, `meta`, `foot` |
| `loop` | `heading`, `nodes` (array), `accent` (index), `caption`, `foot` |
| `boundary` | `heading`, `foot` |
| `bullets` | `heading`, `bullets` (array), `foot` |
| `close` | `heading`, `foot` |

`foot` is a two-element array: `["left label", "right label"]`.

---

### `list`

Print all posts with their lecture count and live/draft status.

```bash
npm run asa -- list
# [live]  my-post-slug (4 lectures) — My Post Title
# [draft] wip-post (0 lectures) — wip-post
```

---

### `validate`

Check all posts and lectures for required frontmatter fields. Exits `1` on error.

```bash
npm run asa -- validate
# all content valid

# or:
#   x my-post-slug/index.mdx: missing field "excerpt"
```

Useful as a pre-build check.

---

## `--json` flag

Any command accepts `--json` for machine-readable output. Useful for agents.

```bash
npm run asa -- list --json
# [{ "slug": "...", "title": "...", "placeholder": false, "lectureCount": 4 }]

npm run asa -- validate --json
# { "valid": true }
# or: { "valid": false, "errors": ["..."] }
```

---

## Content structure

```
content/
  posts/
    <slug>/
      index.mdx          # post metadata + body prose
      lectures/
        L1.mdx
        L2.mdx
        ...
      deck/
        slides.yaml      # all slides for the deck viewer
  decks/
    <slug>.yaml          # deck listing metadata
```

---

## Typical agent workflow

```bash
# 1. scaffold
npm run asa -- new post control-loop-patterns

# 2. fill in index.mdx, then add lectures
npm run asa -- new lecture control-loop-patterns L1
npm run asa -- new lecture control-loop-patterns L2

# 3. validate before committing
npm run asa -- validate

# 4. check what's live
npm run asa -- list
```
