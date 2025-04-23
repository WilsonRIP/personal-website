import { Suspense } from "react";
import { getGithubRepos } from "@/lib/github";
import { getGithubUserStats } from "@/lib/githubStats";
import ProjectsList from "./components/ProjectsList";
import ProjectsStats from "./components/ProjectsStats";
import { socialLinks } from "../data/socials";
export const metadata = {
  title: "Projects",
  description: "Explore my GitHub repositories and projects",
};

export default async function ProjectsPage() {
  // Server-side data fetching using React's cache
  const repos = await getGithubRepos();
  const stats = await getGithubUserStats();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-10 lg:p-16 bg-theme-gradient">
      <div className="w-full max-w-6xl space-y-12">
        <header className="text-center relative">
          {/* Decorative elements */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl dark:bg-blue-500/10 -z-10"></div>
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-green-500/5 rounded-full blur-3xl dark:bg-green-500/10 -z-10"></div>

          <div className="inline-block mb-3 bg-gradient-to-r from-blue-500/10 to-green-500/10 dark:from-blue-500/20 dark:to-green-500/20 rounded-full px-4 py-1.5">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              GitHub Portfolio
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-4">
            My Projects
          </h1>

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Browse through my GitHub repositories. These projects showcase my
            skills, interests, and development journey.
          </p>

          <div className="mt-8 flex justify-center space-x-4">
            <a
              href={socialLinks[3].url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white font-medium transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 dark:hover:bg-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              View GitHub Profile
            </a>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Loading projects...
                </p>
              </div>
            </div>
          }
        >
          <ProjectsList initialRepos={repos} />
        </Suspense>

        {repos.length > 0 && (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-48 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-blue-500"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    Loading stats...
                  </p>
                </div>
              </div>
            }
          >
            <ProjectsStats repos={repos} stats={stats} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
