// Server component: loads lectures at build time, passes to client view.
import ReaderView from "./reader-view";
import { getLectures, getPosts } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  // Emit a reader page for each non-placeholder post that actually has lectures.
  return getPosts()
    .filter((p) => !p.placeholder)
    .filter((p) => getLectures(p.slug).length > 0)
    .map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function ReaderPage({ params }: Props) {
  const { slug } = await params;
  const lectures = getLectures(slug);
  return <ReaderView lectures={lectures} />;
}
