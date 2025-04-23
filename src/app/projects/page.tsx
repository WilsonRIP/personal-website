'use client';

import React, { useState, memo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getGithubRepos, GithubRepo } from '@/lib/github';
import { getGithubUserStats, GithubUserStats } from '@/lib/githubStats';
import { WEBSITE_NAME } from '@/lib/types';
import { useTheme } from '@/lib/ThemeContext';
import LazyLoad from '@/lib/LazyLoad';
import OptimizedImage from '../components/OptimizedImage';

function ProjectsPage() {
  const { theme } = useTheme();
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [stats, setStats] = useState<GithubUserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Number of projects per page - adjust based on screen size
  // 6 cards per page on large screens = 2 rows of 3
  const projectsPerPage = 6;
  
  // Calculate total number of pages
  const totalPages = Math.ceil(repos.length / projectsPerPage);
  
  // Get current projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = repos.slice(indexOfFirstProject, indexOfLastProject);
  
  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Fetch repositories and stats in parallel
        const [reposData, statsData] = await Promise.all([
          getGithubRepos(),
          getGithubUserStats()
        ]);
        
        setRepos(reposData);
        setStats(statsData);
        setError('');
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to load GitHub data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Pagination Controls
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid when changing pages
    document.getElementById('projects-grid')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center space-x-2 mt-12">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-500 hover:text-white transition-colors'}`}
        >
          &laquo; Prev
        </button>
        
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index + 1)}
            className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-teal-500 text-white' : `${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} hover:bg-teal-500 hover:text-white transition-colors`}`}
          >
            {index + 1}
          </button>
        ))}
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-500 hover:text-white transition-colors'}`}
        >
          Next &raquo;
        </button>
      </div>
    );
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24 bg-theme-gradient">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-4">
            My Projects
          </h1>
          <p className="text-lg max-w-2xl mx-auto dark:text-gray-300 text-gray-700">
            Here are some of my recent GitHub projects. Feel free to check them out and contribute!
          </p>
        </div>
        
        {loading ? (
          <div className="text-center p-8 rounded-lg dark:bg-gray-800/50 bg-white/50 backdrop-blur-md shadow-xl">
            <h3 className="text-2xl font-semibold mb-2">
              Loading repositories...
            </h3>
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-8 rounded-lg dark:bg-gray-800/50 bg-white/50 backdrop-blur-md shadow-xl text-red-500">
            <h3 className="text-2xl font-semibold mb-2">
              Error
            </h3>
            <p>{error}</p>
          </div>
        ) : repos.length === 0 ? (
          <div className="text-center p-8 rounded-lg dark:bg-gray-800/50 bg-white/50 backdrop-blur-md shadow-xl">
            <h3 className="text-2xl font-semibold mb-2">
              No repositories found
            </h3>
            <p>I haven't added any public repositories yet, or there might be an issue with the GitHub API.</p>
          </div>
        ) : (
          <>
            <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} />
              ))}
            </div>
            {renderPagination()}
            
            {/* GitHub Stats Section */}
            {stats && (
              <LazyLoad>
                <div className="mt-16 rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-2xl font-bold mb-6 text-teal-500 text-center">
                    GitHub Statistics
                  </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {/* Stats Cards */}
                  <div className="rounded-lg p-4 text-center dark:bg-gray-700/50 bg-gray-100/80 backdrop-blur-md">
                    <div className="text-3xl font-bold text-teal-500 mb-1">{stats.totalRepos}</div>
                    <div className="text-sm dark:text-gray-300 text-gray-700">Repositories</div>
                  </div>
                  
                  <div className="rounded-lg p-4 text-center dark:bg-gray-700/50 bg-gray-100/80 backdrop-blur-md">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">{stats.totalStars}</div>
                    <div className="text-sm dark:text-gray-300 text-gray-700">Stars</div>
                  </div>
                  
                  <div className="rounded-lg p-4 text-center dark:bg-gray-700/50 bg-gray-100/80 backdrop-blur-md">
                    <div className="text-3xl font-bold text-blue-500 mb-1">{stats.totalForks}</div>
                    <div className="text-sm dark:text-gray-300 text-gray-700">Forks</div>
                  </div>
                  
                  <div className="rounded-lg p-4 text-center dark:bg-gray-700/50 bg-gray-100/80 backdrop-blur-md">
                    <div className="text-3xl font-bold text-purple-500 mb-1">
                      {formatDate(stats.earliestRepo).split(' ')[2] /* Just the year */}
                    </div>
                    <div className="text-sm dark:text-gray-300 text-gray-700">Since</div>
                  </div>
                </div>
                
                {/* Languages */}
                {stats.topLanguages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 dark:text-gray-300 text-gray-700">Top Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {stats.topLanguages.map((lang) => (
                        <div 
                          key={lang.name} 
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/20 to-blue-500/20 dark:from-teal-500/40 dark:to-blue-500/40 border border-teal-200 dark:border-teal-700 text-sm"
                        >
                          <span className="font-medium dark:text-gray-200 text-gray-800">{lang.name}</span>
                          <span className="ml-2 text-xs dark:text-gray-300 text-gray-600">{lang.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Activity Timeline */}
                <div className="flex justify-between items-center text-sm dark:text-gray-400 text-gray-500">
                  <div>
                    <span className="font-medium">First Repository:</span> {formatDate(stats.earliestRepo)}
                  </div>
                  <div>
                    <span className="font-medium">Latest Activity:</span> {formatDate(stats.latestRepo)}
                  </div>
                </div>
              </div>
              </LazyLoad>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// Helper function to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Memoize the ProjectCard to prevent unnecessary re-renders
const ProjectCard = memo(function ProjectCard({ repo }: { repo: GithubRepo }) {
  const date = new Date(repo.pushed_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <LazyLoad
      placeholder={
        <div className="flex flex-col h-full rounded-xl overflow-hidden shadow-lg animate-pulse dark:bg-gray-800/50 bg-gray-100/80 backdrop-blur-md border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
          <div className="mt-auto bg-gray-300 dark:bg-gray-700 p-4"></div>
        </div>
      }
    >
      <div className="flex flex-col h-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 hover:scale-[1.02]">
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-teal-500 line-clamp-1">
              {repo.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="dark:text-gray-300 text-gray-600">{repo.stargazers_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
                <span className="dark:text-gray-300 text-gray-600">{repo.forks_count}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm dark:text-gray-300 text-gray-700 mb-4 line-clamp-3 flex-grow">
            {repo.description || 'No description provided'}
          </p>
          
          {repo.language && (
            <div className="mb-3 flex items-center">
              <span className="inline-block h-3 w-3 rounded-full bg-teal-400 mr-2"></span>
              <span className="text-sm font-medium dark:text-gray-300 text-gray-700">{repo.language}</span>
            </div>
          )}
          
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {repo.topics.slice(0, 3).map((topic) => (
                <span key={topic} className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  {topic}
                </span>
              ))}
              {repo.topics.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                  +{repo.topics.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto">
            Updated: {date}
          </div>
        </div>
        
        <div className="mt-auto bg-gradient-to-r from-teal-500 to-blue-500 p-4">
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center font-medium text-white hover:underline"
          >
            View Repository
          </a>
        </div>
      </div>
    </LazyLoad>
  );
});

export default ProjectsPage;