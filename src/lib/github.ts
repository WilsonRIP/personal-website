import { cache } from 'react';
import 'server-only';
import { socialLinks } from '@/app/data/socials';

// Rate limiting utility
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Extract GitHub username from the GitHub URL in socials
export function getGithubUsername(): string {
  const githubSocial = socialLinks.find(social => social.name === 'GitHub');
  if (!githubSocial) {
    return '';
  }
  
  // Extract username from the GitHub URL
  const username = githubSocial.url.split('github.com/')[1];
  return username || '';
}

// Get GitHub authentication token from environment variables
function getGithubToken(): string | null {
  return process.env.GITHUB_TOKEN || null;
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  created_at: string;
  fork: boolean;
  open_issues_count?: number;
  size?: number; // Size in KB
  private?: boolean; // Add private flag
}

// Optional preload function to initiate data fetch early
export const preloadGithubRepos = () => {
  void getGithubRepos();
}

// Function to fetch private repositories (for commit counting only)
export const getPrivateRepos = cache(async (): Promise<GithubRepo[]> => {
  const username = getGithubUsername();
  const token = getGithubToken();
  
  if (!username || !token) {
    return [];
  }
  
  try {
    let allRepos: GithubRepo[] = [];
    let page = 1;
    let hasMorePages = true;
    
    while (hasMorePages) {
      console.log(`Fetching private GitHub repos page ${page}...`);
      
      if (page > 1) {
        await delay(500); // Increased from 200ms to 500ms
      }
      
      const response = await fetch(
        `https://api.github.com/user/repos?sort=updated&per_page=100&page=${page}&visibility=private`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${token}`,
          },
          next: { revalidate: 7200 } // Increased cache time
        }
      );
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('GitHub API rate limited for private repos');
          return allRepos;
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const repos: GithubRepo[] = await response.json();
      
      if (repos.length === 0 || repos.length < 100) {
        hasMorePages = false;
      }
      
      allRepos = [...allRepos, ...repos];
      page++;
      
      // Safety check to prevent infinite loops - reduced from 10 to 5 pages
      if (page > 5) {
        hasMorePages = false;
        console.warn('Reached maximum page count (5) when fetching private GitHub repositories');
      }
    }
    
    // Filter out forked repositories and mark as private
    return allRepos
      .filter(repo => !repo.fork)
      .map(repo => ({ ...repo, private: true }));
  } catch (error) {
    console.error('Failed to fetch private GitHub repositories:', error);
    return [];
  }
});

// Use React's built-in cache instead of manual implementation
export const getGithubRepos = cache(async (): Promise<GithubRepo[]> => {
  const username = getGithubUsername();
  if (!username) {
    return [];
  }
  
  try {
    // Fetch to get the first page and check response headers for pagination information
    let allRepos: GithubRepo[] = [];
    let page = 1;
    let hasMorePages = true;
    
    // GitHub API pagination - keep fetching until we get all repositories
    while (hasMorePages) {
      console.log(`Fetching GitHub repos page ${page}...`);
      
      // Add delay between requests to avoid rate limiting
      if (page > 1) {
        await delay(500); // Increased from 200ms to 500ms
      }
      
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&page=${page}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
          // Use Next.js fetch cache control - increased cache time
          next: { revalidate: 7200 } // Revalidate every 2 hours instead of 1
        }
      );
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('GitHub API rate limited - returning cached data if available');
          // Return whatever we have so far, or empty array if nothing cached
          return allRepos.filter(repo => !repo.fork);
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const repos: GithubRepo[] = await response.json();
      
      // If we get fewer results than the per_page value, we've reached the last page
      if (repos.length === 0 || repos.length < 100) {
        hasMorePages = false;
      }
      
      allRepos = [...allRepos, ...repos];
      page++;
      
      // Safety check to prevent infinite loops - reduced from 10 to 5 pages
      if (page > 5) {
        hasMorePages = false;
        console.warn('Reached maximum page count (5) when fetching GitHub repositories');
      }
    }
    
    // Filter out forked repositories and mark as public
    return allRepos
      .filter(repo => !repo.fork)
      .map(repo => ({ ...repo, private: false }));
  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error);
    return [];
  }
});
