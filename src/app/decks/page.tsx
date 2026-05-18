import Link from "next/link";
import { getDecks } from "@/lib/content";

export default function DecksPage() {
  const decks = getDecks();

  return (
    <main className="page">
      <div className="container narrow">
        <nav className="crumbs">
          <Link href="/">asa</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>decks</span>
        </nav>

        <header className="post-head">
          <div className="date">slide decks · 16:9</div>
          <h1>Slides, for when text isn&apos;t enough.</h1>
          <p className="lede">
            Each deck pairs with a written essay. Same spine, fewer words, more
            space — read at your own pace or speak from them.
          </p>
        </header>

        {decks.map((d) =>
          d.placeholder ? (
            <div key={d.slug} className="deck-card" style={{ opacity: 0.6, cursor: "default" }}>
              <div className="thumb">
                <div className="miniT" style={{ whiteSpace: "pre-line" }}>
                  {d.miniT}
                </div>
                <div className="miniMeta">{d.miniMeta}</div>
              </div>
              <div>
                <h3>{d.title}</h3>
                <div className="meta">{d.meta}</div>
              </div>
              <span className="arr">›</span>
            </div>
          ) : (
            <Link
              key={d.slug}
              href={`/deck/${d.slug}/`}
              className="deck-card"
            >
              <div className="thumb">
                <div className="miniT" style={{ whiteSpace: "pre-line" }}>
                  {d.miniT}
                </div>
                <div className="miniMeta">{d.miniMeta}</div>
              </div>
              <div>
                <h3>{d.title}</h3>
                <div className="meta">{d.meta}</div>
              </div>
              <span className="arr">›</span>
            </Link>
          )
        )}
      </div>
    </main>
  );
}
