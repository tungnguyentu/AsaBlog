import { getPosts } from "@/lib/content";
import HomeView from "./home-view";

// Server component: loads posts at build time, passes to client view.
export default function HomePage() {
  const posts = getPosts();
  return <HomeView posts={posts} />;
}
