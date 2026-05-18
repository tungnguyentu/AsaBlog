// Server component: loads lectures at build time, passes to client view.
import ReaderView from "./reader-view";
import { getDecks, getLectures } from "@/lib/content";

export function generateStaticParams() {
  // Emit a reader page for each deck that has a linked post with lectures.
  return getDecks()
    .filter((d) => !d.placeholder && d.postSlug)
    .map((d) => ({ slug: d.postSlug as string }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function ReaderPage({ params }: Props) {
  const { slug } = await params;
  const lectures = getLectures(slug);
  return <ReaderView lectures={lectures} />;
}
