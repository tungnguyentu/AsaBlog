import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/context/lang-context";
import { SiteShell } from "@/components/site-shell";
import { getPosts, getLectures, buildSearchIndex, SEARCH_RECENTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Asa — notes & decks",
  description:
    "Field notes from building quiet, observable, stubbornly verifiable software.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = getPosts();
  const lectures = getLectures("harness-engineering");
  const searchIndex = buildSearchIndex(posts, lectures);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <LangProvider>
          <SiteShell searchIndex={searchIndex} searchRecents={SEARCH_RECENTS}>
            {children}
          </SiteShell>
        </LangProvider>
      </body>
    </html>
  );
}
