import { getGithubUsername } from './github';

export interface GithubUserStats {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  topLanguages: Array<{ name: string; count: number }>;
  earliestRepo: string; // Date string
  latestRepo: string;   // Date string
  totalCommits?: number; // Optional as this requires additional API calls
}

// Function to fetch GitHub user statistics
export async function getGithubUserStats(): Promise<GithubUserStats> {
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
    // We can reuse our existing function
    const repos = await fetchAllRepos(username);
    
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
}

// Helper function to fetch all repositories
async function fetchAllRepos(username: string) {
  let allRepos: any[] = [];
  let page = 1;
  let hasMorePages = true;
  
  while (hasMorePages) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&page=${page}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 }
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const repos = await response.json();
    
    if (repos.length === 0 || repos.length < 100) {
      hasMorePages = false;
    }
    
    allRepos = [...allRepos, ...repos];
    page++;
    
    if (page > 10) {
      hasMorePages = false;
    }
  }
  
  return allRepos;
}
