# Writing a Post

A post lives in `content/posts/<slug>/`. The slug becomes the URL: `/post/<slug>`.

---

## 1. Scaffold the post

```bash
npm run asa -- new post my-post-slug
```

Opens `content/posts/my-post-slug/index.mdx`. Edit it:

```
---
title: "Your post title"
date: "2026-05-18"
tags: ["essay"]
readLabel: "10 min"
excerpt: "One sentence that describes the post — shown in the home list."
placeholder: false
---

Your body prose here. This appears on the /post/<slug> page.
```

**`placeholder: true`** — keeps the post in the codebase but disables the link on the home page. Use it for drafts.

---

## 2. Add lectures (optional)

Lectures power the `/reader/<slug>` page — a long-form reading view with a sticky TOC and margin notes. Skip this section if your post has no lectures.

```bash
npm run asa -- new lecture my-post-slug L1
npm run asa -- new lecture my-post-slug L2
```

Edit each `content/posts/my-post-slug/lectures/L1.mdx`:

```
---
id: "L1"
num: "Lecture 01"
title: "The loop, defined"
lead: "Every harness is a closed loop. Open loops drift, closed loops correct."
r: "The main body paragraph for this lecture. One to three sentences that form the reading text shown in the article column."
note: "The margin note — a sharp one-liner, a counterpoint, or an aphorism that sharpens the main text."
notes: "Meta-note for the reader: a first-impression framing, a heuristic, or a reading tip."
---
```

Lectures are sorted by filename (`L1.mdx`, `L2.mdx`, …) and shown in that order in the Reader TOC.

---

## 3. Add a slide deck (optional)

A deck powers the `/deck/<slug>` viewer — a 16:9 slide-by-slide presentation. Skip if the post has no deck.

```bash
npm run asa -- new slide my-post-slug   # repeat for each slide
```

Edit `content/posts/my-post-slug/deck/slides.yaml`:

```yaml
slides:
  - type: title
    n: "01 · title"
    heading: "My Post"
    sub: "A subtitle"
    meta: "2026"
    foot: ["asa · journal", "may 2026"]

  - type: bullets
    n: "02 · key points"
    heading: "Key Points"
    bullets:
      - "First point"
      - "Second point"
      - "Third point"
    foot: ["section 01", ""]

  - type: close
    n: "03 · close"
    heading: "Thank you"
    foot: ["", "asa.zentry.site"]
```

**Slide types:**

| Type | Use for |
|---|---|
| `title` | Opening slide with heading, subtitle, meta line |
| `bullets` | Key points list |
| `loop` | Flow diagram — provide `nodes` array and `accent` index |
| `boundary` | Visibility boundary diagram |
| `close` | Closing / thank-you slide |

---

## 4. Add SVG spine diagrams (optional)

Spine diagrams are monochrome SVG flow charts with a single terracotta accent. They appear on the `/post/<slug>` page in numbered cards with a title and caption.

### Existing diagrams

Three reusable diagrams already exist in `src/components/spine-diagrams.tsx`:

| Component | What it shows |
|---|---|
| `SpineDiagram1` | Closed-loop flow: Intent → Plan → Execute → Verify → Record → repeat |
| `SpineDiagram2` | Agent visibility boundary: world → tools/memory → agent → action |
| `SpineDiagram3` | Feature state machine: not_started → active ↔ blocked → passing |

To use them in your post page (`src/app/post/[slug]/page.tsx`), import and drop them in:

```tsx
import { SpineDiagram1, SpineDiagram2, SpineDiagram3 } from "@/components/spine-diagrams";

// inside your JSX:
<div className="diagram-card">
  <div className="num" />
  <h3>Closed-loop flow</h3>
  <p className="caption">Your caption here.</p>
  <SpineDiagram1 />
</div>
```

### Creating a new diagram

1. Open `src/components/spine-diagrams.tsx` and add a new exported function.
2. Use the built-in primitives already in the file:

```tsx
// Rectangular node with rounded corners
<Node x={40} y={80} w={110} h={44} label="My Step" />

// Strong (filled) variant — use for key nodes
<Node x={40} y={80} w={110} h={44} label="Verify" strong />

// Monospace label (for state names, IDs)
<Node x={40} y={80} w={110} h={44} label="not_started" mono />

// Arrow between two nodes (standard ink colour)
<line x1={150} y1={102} x2={200} y2={102}
  className="line-stroke" markerEnd="url(#ah)" />

// Arrow in terracotta accent colour (use for the key/return path)
<line x1={150} y1={102} x2={200} y2={102}
  className="accent-stroke" markerEnd="url(#ah-a)" />

// Dashed line (for secondary / "unseen" paths)
<path d="M 120 175 C 240 220, 500 220, 670 175" className="line-dash" />

// Curved path (e.g. loop-back arc)
<path d="M 400 124 C 400 180, 80 180, 80 124"
  className="accent-stroke" markerEnd="url(#ah-a)" />

// Small label beneath an arrow or at diagram bottom
<text x={360} y={190} textAnchor="middle" className="label-mono label-mute">
  your annotation
</text>

// Dashed boundary rectangle (e.g. scope / context box)
<rect x="270" y="40" width="280" height="160" rx="14" className="boundary" />
<text x="410" y="32" textAnchor="middle" className="label-mono label-mute">
  boundary label
</text>
```

3. Always wrap the SVG with `<ArrowDefs />` as the first child so arrowheads render:

```tsx
export function MyDiagram() {
  return (
    <svg className="diagram-svg" viewBox="0 0 720 200"
      role="img" aria-label="Description for screen readers.">
      <ArrowDefs />
      {/* your nodes and arrows */}
    </svg>
  );
}
```

4. Keep `viewBox` width at `720` — the CSS scales it responsively. Adjust height to fit (160–280 is typical).

5. Import and place the new component in your post page the same way as the existing ones.

---

## 5. Tag your post

Tags appear as filter chips on the home page. Use any combination:

| Tag | Meaning |
|---|---|
| `essay` | Long-form written piece |
| `reader` | Has a Reader + margin notes (`/reader/<slug>`) |
| `deck` | Has a slide deck (`/deck/<slug>`) |
| `note` | Short note or observation |
| `diagram` | Primarily visual / diagram-heavy |

---

## 5. Validate

Before committing, check all required fields are present:

```bash
npm run asa -- validate
# all content valid
```

---

## 6. Preview

The dev server hot-reloads on file saves:

```bash
npm run dev
# open http://localhost:3000
```

Your post appears on the home page. Click through to `/post/<slug>`, `/reader/<slug>`, and `/deck/<slug>` to check each view.

---

## File structure for a full post

```
content/posts/my-post-slug/
  index.mdx          ← required
  lectures/
    L1.mdx           ← optional, for Reader view
    L2.mdx
  deck/
    slides.yaml      ← optional, for Deck viewer
```
