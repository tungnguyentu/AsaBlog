// Server component: loads slides at build time, passes to client view.
import DeckView from "./deck-view";
import { getDecks, getSlides } from "@/lib/content";

export function generateStaticParams() {
  return getDecks()
    .filter((d) => !d.placeholder)
    .map((d) => ({ slug: d.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function DeckPage({ params }: Props) {
  const { slug } = await params;
  const slides = getSlides(slug);
  return <DeckView slides={slides} />;
}
