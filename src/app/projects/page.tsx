import { Suspense } from 'react';
import { getGithubRepos } from '@/lib/github';
import { getGithubUserStats } from '@/lib/githubStats';
import ProjectsList from './components/ProjectsList';
import ProjectsStats from './components/ProjectsStats';

export const metadata = {
  title: 'Projects',
  description: 'Explore my GitHub repositories and projects',
};

export default async function ProjectsPage() {
  // Server-side data fetching using React's cache
  const repos = await getGithubRepos();
  const stats = await getGithubUserStats();
  
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-10 lg:p-16 bg-theme-gradient">
      <div className="w-full max-w-6xl space-y-10">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-3">
            My Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Browse through my GitHub repositories. These projects showcase my skills, interests, and development journey.
          </p>
        </header>
        
        <Suspense fallback={
          <div className="flex justify-center items-center h-64 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          <ProjectsList initialRepos={repos} />
        </Suspense>
        
        {repos.length > 0 && (
          <Suspense fallback={
            <div className="flex justify-center items-center h-48 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }>
            <ProjectsStats repos={repos} stats={stats} />
          </Suspense>
        )}
      </div>
    </main>
  );
}