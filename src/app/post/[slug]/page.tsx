import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts, getPost } from "@/lib/content";
import {
  SpineDiagram1,
  SpineDiagram2,
  SpineDiagram3,
} from "@/components/spine-diagrams";

export const dynamicParams = false;

export const generateStaticParams = async () => {
  return getPosts()
    .filter((p) => !p.placeholder)
    .map((p) => ({ slug: p.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.placeholder) notFound();

  return (
    <main>
      <Link className="back" href="/">← writing</Link>

      <header className="post-head">
        <div className="meta">{post.dateLabel} · essay</div>
        <h1>{post.title}</h1>
        <p className="lede">{post.excerpt}</p>
      </header>

      <article className="body">
        <div className="reader-row">
          <Link
            className="reader-card"
            href="/reader/harness-engineering/"
          >
            <div className="kind">primary read</div>
            <div className="ttl">Reader &amp; Notes</div>
            <div className="sub">
              Twelve lectures, each in plain language with a margin note. Three
              spine diagrams. Search included.
            </div>
            <div className="more">
              open reader
              <span style={{ fontFamily: "var(--serif)", fontSize: 14 }}>
                ›
              </span>
            </div>
          </Link>
          <Link className="reader-card" href={`/full/${slug}/`}>
            <div className="kind">lookup</div>
            <div className="ttl">Full text</div>
            <div className="sub">
              The unbroken transcript. Use this when you remember a phrase and
              need to find its lecture.
            </div>
            <div className="more">
              open full text
              <span style={{ fontFamily: "var(--serif)", fontSize: 14 }}>
                ›
              </span>
            </div>
          </Link>
        </div>

        <section className="spines" style={{ counterReset: "spine" }}>
          <h2>three spine diagrams</h2>

          <div className="diagram-card">
            <div className="num" />
            <h3>Closed-loop flow</h3>
            <p className="caption">
              Every cycle returns to a written status. No status, no progress —
              the loop is the unit of work.
            </p>
            <SpineDiagram1 />
          </div>

          <div className="diagram-card">
            <div className="num" />
            <h3>Agent visibility boundary</h3>
            <p className="caption">
              Whatever the agent can&apos;t see, it cannot reason about. The
              boundary is the design.
            </p>
            <SpineDiagram2 />
          </div>

          <div className="diagram-card">
            <div className="num" />
            <h3>Feature state machine</h3>
            <p className="caption">
              States are observable. Transitions are recorded. Blocks are
              first-class — not exceptions.
            </p>
            <SpineDiagram3 />
          </div>
        </section>

        <div className="reader-actions">
          <Link href="/">← back to writing</Link>
          <Link href="/reader/harness-engineering/">read full essay →</Link>
        </div>
      </article>
    </main>
  );
}
