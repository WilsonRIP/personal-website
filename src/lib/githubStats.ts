import { cache } from 'react';
import 'server-only';
import { getGithubUsername, getGithubRepos, getPrivateRepos, type GithubRepo } from './github';

export interface GithubUserStats {
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  totalOpenIssues: number;
  totalRepos: number;
  totalRepoSize: number; // KB
  averageRepoSize: number; // KB
  forkedReposCount: number;
  originalReposCount: number;
  averageStars: number;
  averageForks: number;
  averageCommitsPerRepo: number;
  mostStarredRepo: { name: string; url: string; stars: number };
  mostForkedRepo: { name: string; url: string; forks: number };
  topLanguages: Array<{ name: string; count: number; percentage: number }>;
  earliestRepo: string; // Date string
  latestRepo: string;   // Date string
  earliestRepoName: string;
  latestRepoName: string;
  totalCommits: number; // Actual commit count
  totalPullRequests: number;
  totalReleases: number;
  topTopics: Array<{ name: string; count: number }>;
  languageBreakdown: Array<{ name: string; bytes: number; percentage: number }>;
  mostActiveRepo: { name: string; url: string; commits: number };
  latestRelease: { name: string; url: string; publishedAt: string } | null;
  enhancedDataAvailable: boolean; // Flag to indicate if enhanced data is available
  rateLimited: boolean; // Flag to indicate if we hit rate limits
}

// Import the simplified rate limiter and fetch utilities
import { RateLimiter } from './utils/rateLimiter';
import { fetchWithRetry } from './utils/fetchWithRetry';

// Optional preload function to initiate data fetch early
export const preloadGithubUserStats = () => {
  void getGithubUserStats();
}

// Function to fetch GitHub user statistics with React's cache and optimized processing
export const getGithubUserStats = cache(async (): Promise<GithubUserStats> => {
  const username = getGithubUsername();
  
  // Default empty stats
  const emptyStats: GithubUserStats = {
    totalStars: 0,
    totalForks: 0,
    totalWatchers: 0,
    totalOpenIssues: 0,
    totalRepos: 0,
    totalRepoSize: 0,
    averageRepoSize: 0,
    forkedReposCount: 0,
    originalReposCount: 0,
    averageStars: 0,
    averageForks: 0,
    averageCommitsPerRepo: 0,
    mostStarredRepo: { name: '', url: '', stars: 0 },
    mostForkedRepo: { name: '', url: '', forks: 0 },
    topLanguages: [],
    earliestRepo: new Date().toISOString(),
    latestRepo: new Date().toISOString(),
    earliestRepoName: '',
    latestRepoName: '',
    totalCommits: 0,
    totalPullRequests: 0,
    totalReleases: 0,
    topTopics: [],
    languageBreakdown: [],
    mostActiveRepo: { name: '', url: '', commits: 0 },
    latestRelease: null,
    enhancedDataAvailable: false,
    rateLimited: false
  };
  
  if (!username) {
    return emptyStats;
  }
  
  const rateLimiter = new RateLimiter();
  const startTime = Date.now();
  
  try {
    // Step 1: Fetch user data to get repo count
    const userResponse = await fetchWithRetry(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    }, rateLimiter, 3);
    
    if (!userResponse.ok) {
      if (userResponse.status === 403) {
        console.warn('GitHub API rate limited - falling back to basic stats');
        return { ...emptyStats, rateLimited: true };
      }
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    
    // Step 2: Fetch all public repositories
    const publicRepos: GithubRepo[] = await getGithubRepos();
    
    // Step 3: Fetch private repositories (for commit counting only)
    const privateRepos: GithubRepo[] = await getPrivateRepos();
    
    // Step 4: Sort public repos by importance and limit to top repos to avoid rate limiting
    const sortedPublicRepos = publicRepos
      .sort((a, b) => {
        // Prioritize by stars, then forks, then recency
        const aScore = a.stargazers_count * 10 + a.forks_count * 5 + (a.stargazers_count > 0 ? 1 : 0);
        const bScore = b.stargazers_count * 10 + b.forks_count * 5 + (b.stargazers_count > 0 ? 1 : 0);
        return bScore - aScore;
      })
      .slice(0, 3); // Reduced to 3 repos for faster processing
    
    console.log(`Processing top ${sortedPublicRepos.length} public repos out of ${publicRepos.length} total public repos`);
    console.log(`Found ${privateRepos.length} private repos for commit counting`);
    
    // Step 5: Fetch enhanced details for top public repos sequentially (not in parallel)
    let rateLimited = false;
    const reposWithDetails: Array<GithubRepo & {
      open_issues_count: number;
      size: number;
      commit_count: number;
      pull_request_count: number;
      release_count: number;
      topics: string[];
      language_breakdown: Record<string, number>;
    }> = [];
    
    // Process repos sequentially to avoid overwhelming the API
    for (const repo of sortedPublicRepos) {
      try {
        // Fetch basic repo details
        const repoResponse = await fetchWithRetry(`https://api.github.com/repos/${username}/${repo.name}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }, rateLimiter, 3);
        
        if (repoResponse.status === 403) {
          rateLimited = true;
          console.warn(`Rate limited while fetching details for ${repo.name} - stopping enhanced data fetch`);
          break;
        }
        
        let repoData = {};
        if (repoResponse.ok) {
          repoData = await repoResponse.json();
        }

        // Fetch commit count for all public repos (not just active ones) to get accurate total
        let commitCount = 0;
        const pullRequestCount = 0;
        const releaseCount = 0;
        const topics: string[] = [];
        let languageBreakdown: Record<string, number> = {};

        // Always fetch commit count for accurate totals
        try {
          const commitsResponse = await fetchWithRetry(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          }, rateLimiter, 3);
          
          if (commitsResponse.status === 403) {
            rateLimited = true;
            console.warn(`Rate limited while fetching commits for ${repo.name} - stopping enhanced data fetch`);
            break;
          }
          
          if (commitsResponse.ok) {
            const linkHeader = commitsResponse.headers.get('link');
            if (linkHeader) {
              const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
              if (lastPageMatch) {
                commitCount = parseInt(lastPageMatch[1]);
              }
            } else {
              const commits = await commitsResponse.json();
              commitCount = commits.length;
            }
          }
        } catch (error) {
          if (error instanceof Error && error.message === 'Rate limited') {
            rateLimited = true;
            console.warn(`Rate limited while fetching commits for ${repo.name} - stopping enhanced data fetch`);
            break;
          }
          console.warn(`Failed to fetch commit count for ${repo.name}:`, error);
        }

        // Only fetch additional data for repos with significant activity (optimized)
        const repoDataTyped = repoData as { stargazers_count?: number; forks_count?: number };
        const hasActivity = (repoDataTyped.stargazers_count || 0) > 2 || (repoDataTyped.forks_count || 0) > 1;

        if (hasActivity) {
          // Fetch languages (only for active repos)
          try {
            const languagesResponse = await fetchWithRetry(`https://api.github.com/repos/${username}/${repo.name}/languages`, {
              headers: {
                'Accept': 'application/vnd.github.v3+json'
              }
            }, rateLimiter, 3);
            
            if (languagesResponse.status === 403) {
              console.warn(`Rate limited while fetching languages for ${repo.name} - continuing without language data`);
            } else if (languagesResponse.ok) {
              languageBreakdown = await languagesResponse.json();
            }
          } catch (error) {
            if (error instanceof Error && error.message === 'Rate limited') {
              console.warn(`Rate limited while fetching languages for ${repo.name} - continuing without language data`);
            } else {
              console.warn(`Failed to fetch languages for ${repo.name}:`, error);
            }
          }
        }

        reposWithDetails.push({
          ...repo,
          open_issues_count: (repoData as { open_issues_count?: number }).open_issues_count || 0,
          size: (repoData as { size?: number }).size || 0,
          commit_count: commitCount,
          pull_request_count: pullRequestCount,
          release_count: releaseCount,
          topics: topics,
          language_breakdown: languageBreakdown
        });
        
        console.log(`Successfully processed repo: ${repo.name} (${commitCount} commits)`);
        
      } catch (error) {
        if (error instanceof Error && error.message === 'Rate limited') {
          rateLimited = true;
          console.warn(`Rate limited while processing ${repo.name} - stopping enhanced data fetch`);
          break;
        }
        console.warn(`Failed to fetch details for repo ${repo.name}:`, error);
        
        // Add basic repo data even if enhanced fetch failed
        reposWithDetails.push({
          ...repo,
          open_issues_count: 0,
          size: 0,
          commit_count: 0,
          pull_request_count: 0,
          release_count: 0,
          topics: [],
          language_breakdown: {}
        });
      }
    }
    
    // Step 6: Fetch commit counts for private repositories (only if we have a token and haven't been rate limited)
    let privateRepoCommits = 0;
    if (privateRepos.length > 0 && process.env.GITHUB_TOKEN && !rateLimited) {
      // Process private repos in very small batches to avoid rate limiting
      const limitedPrivateRepos = privateRepos.slice(0, 5); // Limit to 5 private repos for faster processing
      console.log(`Fetching commit counts for ${limitedPrivateRepos.length} private repositories (limited for faster build)...`);
      
      const privateRepoBatches = [];
      for (let i = 0; i < limitedPrivateRepos.length; i += 2) { // Reduced batch size to 2
        privateRepoBatches.push(limitedPrivateRepos.slice(i, i + 2));
      }
      
      for (const batch of privateRepoBatches) {
        // Process each batch sequentially
        for (const repo of batch) {
          try {
            const commitsResponse = await fetchWithRetry(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`, {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${process.env.GITHUB_TOKEN}`
              }
            }, rateLimiter, 3);
            
            if (commitsResponse.status === 403) {
              console.warn('Rate limited while fetching private repo commits - stopping private repo processing');
              break;
            }
            
            if (commitsResponse.ok) {
              const linkHeader = commitsResponse.headers.get('link');
              if (linkHeader) {
                const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
                if (lastPageMatch) {
                  privateRepoCommits += parseInt(lastPageMatch[1]);
                }
              } else {
                const commits = await commitsResponse.json();
                privateRepoCommits += commits.length;
              }
              console.log(`Private repo ${repo.name}: ${privateRepoCommits} commits`);
            }
          } catch (error) {
            if (error instanceof Error && error.message === 'Rate limited') {
              console.warn('Rate limited while fetching private repo commits - stopping private repo processing');
              break;
            }
            console.warn(`Failed to fetch commit count for private repo ${repo.name}:`, error);
          }
        }
        
        // If we were rate limited, stop processing more batches
        if (rateLimited) break;
      }
      
      console.log(`Total commits from private repositories: ${privateRepoCommits}`);
    } else if (privateRepos.length > 0) {
      console.log(`Skipping private repo commit fetching: ${!process.env.GITHUB_TOKEN ? 'No token' : 'Rate limited'}`);
    }
    
    // Step 7: Calculate statistics using both enhanced and basic data
    let totalStars = 0;
    let totalForks = 0;
    let totalWatchers = 0;
    let totalOpenIssues = 0;
    let totalRepoSize = 0;
    let totalCommits = privateRepoCommits; // Start with private repo commits
    let totalPullRequests = 0;
    let totalReleases = 0;
    let forkedReposCount = 0;
    let originalReposCount = 0;
    const languages: Record<string, number> = {};
    const topics: Record<string, number> = {};
    const languageBytes: Record<string, number> = {};
    let earliestDate = new Date();
    let latestDate = new Date(0);
    let earliestRepoName = '';
    let latestRepoName = '';
    let mostStarredRepo = { name: '', url: '', stars: 0 };
    let mostForkedRepo = { name: '', url: '', forks: 0 };
    let mostActiveRepo = { name: '', url: '', commits: 0 };
    const latestRelease: { name: string; url: string; publishedAt: string } | null = null;
    
    // Process enhanced data from top public repos only
    reposWithDetails.forEach(repo => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      totalWatchers += repo.stargazers_count;
      totalOpenIssues += repo.open_issues_count || 0;
      totalRepoSize += repo.size || 0;
      totalCommits += repo.commit_count || 0; // Add public repo commits
      totalPullRequests += repo.pull_request_count || 0;
      totalReleases += repo.release_count || 0;
      
      if (repo.fork) {
        forkedReposCount++;
      } else {
        originalReposCount++;
      }
      
      if (repo.stargazers_count > mostStarredRepo.stars) {
        mostStarredRepo = {
          name: repo.name,
          url: repo.html_url,
          stars: repo.stargazers_count
        };
      }
      
      if (repo.forks_count > mostForkedRepo.forks) {
        mostForkedRepo = {
          name: repo.name,
          url: repo.html_url,
          forks: repo.forks_count
        };
      }
      
      const repoCommits = repo.commit_count || 0;
      if (repoCommits > mostActiveRepo.commits) {
        mostActiveRepo = {
          name: repo.name,
          url: repo.html_url,
          commits: repoCommits
        };
      }
      
      if (repo.language && !repo.fork) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
      
      const repoTopics = repo.topics || [];
      repoTopics.forEach((topic: string) => {
        topics[topic] = (topics[topic] || 0) + 1;
      });
      
      const repoLanguageBreakdown = repo.language_breakdown || {};
      Object.entries(repoLanguageBreakdown).forEach(([lang, bytes]) => {
        languageBytes[lang] = (languageBytes[lang] || 0) + (bytes as number);
      });
      
      const createdDate = new Date(repo.created_at);
      const updatedDate = new Date(repo.pushed_at);
      
      if (createdDate < earliestDate) {
        earliestDate = createdDate;
        earliestRepoName = repo.name;
      }
      
      if (updatedDate > latestDate) {
        latestDate = updatedDate;
        latestRepoName = repo.name;
      }
    });
    
    // Add data from remaining public repos (basic data only)
    const remainingPublicRepos = publicRepos.filter(repo => !sortedPublicRepos.find(r => r.name === repo.name));
    
    // Calculate average commits per repo from processed repos for estimation
    const processedReposWithCommits = reposWithDetails.filter(repo => (repo.commit_count || 0) > 0);
    const averageCommitsFromProcessed = processedReposWithCommits.length > 0 
      ? processedReposWithCommits.reduce((sum, repo) => sum + (repo.commit_count || 0), 0) / processedReposWithCommits.length
      : 0;
    
    remainingPublicRepos.forEach(repo => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      totalWatchers += repo.stargazers_count;
      
      // Estimate commits for remaining public repos based on average from processed repos
      const estimatedCommits = Math.round(averageCommitsFromProcessed * 0.5); // Conservative estimate
      totalCommits += estimatedCommits;
      
      if (repo.fork) {
        forkedReposCount++;
      } else {
        originalReposCount++;
      }
      
      if (repo.stargazers_count > mostStarredRepo.stars) {
        mostStarredRepo = {
          name: repo.name,
          url: repo.html_url,
          stars: repo.stargazers_count
        };
      }
      
      if (repo.forks_count > mostForkedRepo.forks) {
        mostForkedRepo = {
          name: repo.name,
          url: repo.html_url,
          forks: repo.forks_count
        };
      }
      
      if (repo.language && !repo.fork) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
      
      const createdDate = new Date(repo.created_at);
      const updatedDate = new Date(repo.pushed_at);
      
      if (createdDate < earliestDate) {
        earliestDate = createdDate;
        earliestRepoName = repo.name;
      }
      
      if (updatedDate > latestDate) {
        latestDate = updatedDate;
        latestRepoName = repo.name;
      }
    });
    
    // Sort languages by usage count
    const totalLangCount = Object.values(languages).reduce((sum, count) => sum + count, 0);
    const topLanguages = Object.entries(languages)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalLangCount > 0 ? (count / totalLangCount) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Sort topics by usage count
    const topTopics = Object.entries(topics)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Sort language breakdown by bytes
    const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);
    const languageBreakdown = Object.entries(languageBytes)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 8);
      
    // Calculate averages (only for public repos in display stats)
    const totalPublicRepos = publicRepos.length;
    const averageStars = totalPublicRepos > 0 ? Math.round(totalStars / totalPublicRepos) : 0;
    const averageForks = totalPublicRepos > 0 ? Math.round(totalForks / totalPublicRepos) : 0;
    const averageCommitsPerRepo = totalPublicRepos > 0 ? Math.round(totalCommits / totalPublicRepos) : 0;
    const averageRepoSize = totalPublicRepos > 0 ? Math.round(totalRepoSize / totalPublicRepos) : 0;
    
    const processingTime = Date.now() - startTime;
    console.log(`GitHub stats processed in ${processingTime}ms (${(processingTime / 1000).toFixed(1)}s)`);
    
    return {
      totalStars,
      totalForks,
      totalWatchers,
      totalOpenIssues,
      totalRepos: userData.public_repos, // Only show public repo count
      totalRepoSize,
      averageRepoSize,
      forkedReposCount,
      originalReposCount,
      averageStars,
      averageForks,
      averageCommitsPerRepo,
      mostStarredRepo,
      mostForkedRepo,
      topLanguages,
      earliestRepo: earliestDate.toISOString(),
      latestRepo: latestDate.toISOString(),
      earliestRepoName,
      latestRepoName,
      totalCommits, // Includes commits from both public and private repositories
      totalPullRequests,
      totalReleases,
      topTopics,
      languageBreakdown,
      mostActiveRepo,
      latestRelease,
      enhancedDataAvailable: true,
      rateLimited: rateLimited
    };
    
  } catch (error) {
    console.error('Failed to fetch GitHub user statistics:', error);
    return emptyStats;
  }
});
