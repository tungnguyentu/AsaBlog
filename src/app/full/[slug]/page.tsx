import { notFound } from "next/navigation";
import { getPosts, getLectures } from "@/lib/content";
import FullView from "./full-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts()
    .filter((p) => !p.placeholder)
    .filter((p) => getLectures(p.slug).length > 0)
    .map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function FullPage({ params }: Props) {
  const { slug } = await params;
  const lectures = getLectures(slug);
  if (!lectures.length) notFound();
  return <FullView slug={slug} lectures={lectures} />;
}
