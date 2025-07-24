import { Suspense } from "react";
import { getGithubUserStats } from "@/lib/githubStats";
import HomeContent from "./HomeContent";

// Enhanced loading skeleton
const LoadingContainer = ({ className }: { className: string }) => (
  <div className={className}>
    <div className="space-y-6">
      <div className="h-12 bg-muted rounded-lg w-64 mx-auto animate-pulse"></div>
      <div className="h-8 bg-muted rounded w-96 mx-auto animate-pulse"></div>
      <div className="h-6 bg-muted rounded w-80 mx-auto animate-pulse"></div>
    </div>
  </div>
);

// Main page component
export default async function Home() {
  // Fetch GitHub stats
  const githubStats = await getGithubUserStats();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="w-full max-w-6xl mx-auto space-y-20 lg:space-y-24">
          <Suspense fallback={<LoadingContainer className="text-center" />}>
            <HomeContent githubStats={githubStats} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}