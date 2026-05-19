import { getPosts, getLectures } from "@/lib/content";
import HomeView from "./home-view";

// Server component: loads posts + lecture count at build time.
export default function HomePage() {
  const posts = getPosts();
  const lectureCount = getLectures("harness-engineering").length;
  return <HomeView posts={posts} lectureCount={lectureCount} />;
}
