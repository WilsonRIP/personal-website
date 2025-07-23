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

// Simplified loading components
const ProjectsListSkeleton = () => (
  <div className="space-y-8">
    <div className="flex items-center space-x-3 mb-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 animate-pulse"></div>
      <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-card border rounded-lg shadow-sm animate-pulse">
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
  <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-4 border-b border-border">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
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
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="w-full max-w-6xl mx-auto space-y-16">
          
          {/* Header */}
          <header className="text-center">
            <div className="space-y-8">
              {/* Welcome badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                GitHub Portfolio Showcase
              </div>

              {/* Main title */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  My Projects
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Explore my GitHub repositories and discover the projects that showcase my 
                  <span className="font-semibold text-blue-600 dark:text-blue-400"> technical skills</span>,
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400"> creative solutions</span>, and
                  <span className="font-semibold text-violet-600 dark:text-violet-400"> development journey</span>.
                </p>
              </div>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={socialLinks[3]?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-8 py-3 rounded-lg font-semibold bg-foreground text-background shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <Github className="h-5 w-5 mr-2" />
                  View GitHub Profile
                  <ExternalLink className="h-4 w-4 ml-2 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </a>

                <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-muted/50 border text-sm text-muted-foreground">
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

          {/* Footer */}
          <footer className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 border">
              <Github className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Data synced from GitHub API
              </span>
              <span className="text-muted-foreground/50">•</span>
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