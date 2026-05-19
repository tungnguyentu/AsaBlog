# Writing a Post

Posts live in `content/posts/<slug>.md`. The slug becomes the URL: `/posts/<slug>`.

---

## Frontmatter

Every post requires these fields:

```yaml
---
title: "Post title shown on home feed and post page"
date: "2026-05-20"
tag: harness-engineering
diagram: flow
readTime: 8
footnoteCount: 0
excerpt: "One or two sentences. Shown on home feed and in the post sidebar."
---
```

### `tag`

A single string. Appears in the left-rail filter on the home page. Use an existing tag to group posts together, or introduce a new one. Current tags in use:

- `harness-engineering`

### `diagram`

Determines the SVG thumbnail shown on the home feed card and the larger diagram at the top of the post. Choose the one that best fits the post's content:

| Value | Shape | Best for |
|---|---|---|
| `flow` | Linear flow with loop-back | Processes, loops, sequences |
| `mind` | Hub-and-spoke | Concepts, relationships |
| `code` | Code block outline | Technical, implementation posts |
| `graph` | Node graph | Systems, networks, data |

### `excerpt`

Plain text (no Markdown). One to two sentences. The renderer strips `**bold**` markers, but writing plain text is cleaner. Appears in:
- Home feed below the post title
- "Tóm tắt" section in the post page sidebar

---

## Body

Standard Markdown below the closing `---`. All common elements render:

```markdown
## Section heading

Paragraph text. **Bold**, *italic*, `inline code`.

> A blockquote renders with a left border in muted italic.

- List item one
- List item two

1. Numbered item one
2. Numbered item two

\`\`\`python
# Fenced code block — horizontally scrollable
def example():
    pass
\`\`\`
```

Section headings (`##`) are automatically given IDs and collected into the sidebar Table of Contents. No extra markup needed.

---

## Naming the file

Use kebab-case. Descriptive slugs are better than short ones — the slug is permanent.

```
content/posts/why-context-windows-matter.md       ✓
content/posts/context-windows.md                  ✓ (shorter, still fine)
content/posts/post1.md                            ✗ (not descriptive)
```

---

## Example: minimal post

```markdown
---
title: "Why Agents Lose Context Mid-Task"
date: "2026-05-20"
tag: harness-engineering
diagram: flow
readTime: 5
footnoteCount: 0
excerpt: "Context windows have a hard limit. Agents that don't manage state externally will silently degrade as the window fills."
---

Agents are stateless between tool calls. Every token spent re-explaining the project is a token not spent solving the problem.

## The Limit Is Fixed

...
```

---

## Verify before committing

```bash
npm run build   # must exit 0
# then check:
# http://localhost:3000              — post appears on home feed
# http://localhost:3000/posts/<slug> — post page renders correctly
# sidebar TOC populated from ## headings
```
