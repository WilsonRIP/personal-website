import { cache } from 'react';
import 'server-only';
import { getGithubUsername, getGithubRepos, type GithubRepo } from './github';

export interface GithubUserStats {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  topLanguages: Array<{ name: string; count: number }>;
  earliestRepo: string; // Date string
  latestRepo: string;   // Date string
  totalCommits?: number; // Optional as this requires additional API calls
}

// Optional preload function to initiate data fetch early
export const preloadGithubUserStats = () => {
  void getGithubUserStats();
}

// Function to fetch GitHub user statistics with React's cache
export const getGithubUserStats = cache(async (): Promise<GithubUserStats> => {
  const username = getGithubUsername();
  
  // Default empty stats
  const emptyStats: GithubUserStats = {
    totalStars: 0,
    totalForks: 0,
    totalRepos: 0,
    topLanguages: [],
    earliestRepo: new Date().toISOString(),
    latestRepo: new Date().toISOString()
  };
  
  if (!username) {
    return emptyStats;
  }
  
  try {
    // Step 1: Fetch user data to get repo count
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    
    // Step 2: Fetch all repositories to calculate stars, forks, etc.
    // Use the cached getGithubRepos function instead of separate implementation
    const repos: GithubRepo[] = await getGithubRepos();
    
    // Calculate total statistics
    let totalStars = 0;
    let totalForks = 0;
    const languages: Record<string, number> = {};
    let earliestDate = new Date();
    let latestDate = new Date(0); // Unix epoch
    
    // Process each repository
    repos.forEach(repo => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      
      // Track languages
      if (repo.language && !repo.fork) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
      
      // Track earliest and latest repo dates
      const createdDate = new Date(repo.created_at);
      const updatedDate = new Date(repo.pushed_at);
      
      if (createdDate < earliestDate) {
        earliestDate = createdDate;
      }
      
      if (updatedDate > latestDate) {
        latestDate = updatedDate;
      }
    });
    
    // Sort languages by usage count
    const topLanguages = Object.entries(languages)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 languages
      
    return {
      totalStars,
      totalForks,
      totalRepos: userData.public_repos,
      topLanguages,
      earliestRepo: earliestDate.toISOString(),
      latestRepo: latestDate.toISOString()
    };
    
  } catch (error) {
    console.error('Failed to fetch GitHub user statistics:', error);
    return emptyStats;
  }
});
