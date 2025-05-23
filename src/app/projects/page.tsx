import { Suspense } from "react";
import { getGithubRepos } from "@/lib/github";
import { getGithubUserStats } from "@/lib/githubStats";
import ProjectsList from "./components/ProjectsList";
import ProjectsStats from "./components/ProjectsStats";
import { socialLinks } from "../data/socials";
import { Github, ExternalLink, Sparkles, Code2 } from "lucide-react";

export const metadata = {
  title: "Projects",
  description: "Explore my GitHub repositories and projects",
};

// Enhanced loading components
const ProjectsListSkeleton = () => (
  <div className="space-y-8">
    <div className="flex items-center space-x-3 mb-6">
      <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg w-48 animate-pulse"></div>
      <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 animate-pulse">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProjectsStatsSkeleton = () => (
  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse"></div>
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default async function ProjectsPage() {
  // Server-side data fetching
  const repos = await getGithubRepos();
  const stats = await getGithubUserStats();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-10 lg:p-16 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:20px_20px]"></div>
      
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-teal-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 md:px-10 lg:px-16 py-12">
        <div className="w-full max-w-7xl space-y-16">
          
          {/* Enhanced Header */}
          <header className="text-center relative">
            <div className="space-y-8">
              {/* Welcome badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                GitHub Portfolio Showcase
              </div>

              {/* Main title */}
              <div className="space-y-4">
                <h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent leading-tight"
                  style={{ fontFamily: "KOMIKAX, sans-serif" }}
                >
                  My Projects
                </h1>
                
                <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Explore my GitHub repositories and discover the projects that showcase my 
                  <span className="font-semibold text-blue-600 dark:text-blue-400"> technical skills</span>,
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400"> creative solutions</span>, and
                  <span className="font-semibold text-purple-600 dark:text-purple-400"> development journey</span>.
                </p>
              </div>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={socialLinks[3]?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-600 text-white shadow-lg shadow-slate-900/25 hover:shadow-xl hover:shadow-slate-900/40 transition-all duration-300 border-0 hover:scale-105"
                >
                  <Github className="h-5 w-5 mr-2" />
                  View GitHub Profile
                  <ExternalLink className="h-4 w-4 ml-2 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </a>

                <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 text-sm text-slate-600 dark:text-slate-400">
                  <Code2 className="h-4 w-4" />
                  <span className="font-medium">{repos.length} repositories</span>
                </div>
              </div>
            </div>
          </header>

          {/* Projects List Section */}
          <section className="space-y-8">
            <Suspense fallback={<ProjectsListSkeleton />}>
              <ProjectsList initialRepos={repos} />
            </Suspense>
          </section>

          {/* Projects Stats Section */}
          {repos.length > 0 && (
            <section className="space-y-8">
              <Suspense fallback={<ProjectsStatsSkeleton />}>
                <ProjectsStats repos={repos} stats={stats} />
              </Suspense>
            </section>
          )}

          {/* Enhanced Footer */}
          <footer className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <Github className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Data synced from GitHub API
              </span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Updated in real-time
              </span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}