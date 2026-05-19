import { getAllPosts, getTagCounts, getYearCounts } from "@/lib/posts";
import { HomeStream } from "@/components/home-stream";

export default function HomePage() {
  const posts = getAllPosts();
  const tagCounts = getTagCounts();
  const yearCounts = getYearCounts();

  return (
    <HomeStream posts={posts} tagCounts={tagCounts} yearCounts={yearCounts} />
  );
}
