import { socialLinks } from '@/app/data/socials';

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
}

// Cache with in-memory store with TTL (time-to-live)
const CACHE_TTL = 3600 * 1000; // 1 hour in milliseconds
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheItem<any>> = {};

// Helper function for caching API results
function getCachedOrFetch<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  const cachedItem = cache[cacheKey];
  const now = Date.now();
  
  // Return cached data if it exists and is not expired
  if (cachedItem && now - cachedItem.timestamp < ttl) {
    console.log(`Cache hit for ${cacheKey}`);
    return Promise.resolve(cachedItem.data);
  }
  
  // Otherwise fetch fresh data
  return fetchFn().then(data => {
    // Store in cache
    cache[cacheKey] = {
      data,
      timestamp: now
    };
    return data;
  });
}

export async function getGithubRepos(): Promise<GithubRepo[]> {
  const username = getGithubUsername();
  if (!username) {
    return [];
  }
  
  const cacheKey = `github_repos_${username}`;
  
  return getCachedOrFetch(cacheKey, async () => {
    try {
      // Fetch to get the first page and check response headers for pagination information
      let allRepos: GithubRepo[] = [];
      let page = 1;
      let hasMorePages = true;
      
      // GitHub API pagination - keep fetching until we get all repositories
      while (hasMorePages) {
        console.log(`Fetching GitHub repos page ${page}...`);
        
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&page=${page}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
            cache: 'force-cache'
          }
        );
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos: GithubRepo[] = await response.json();
        
        // If we get fewer results than the per_page value, we've reached the last page
        if (repos.length === 0 || repos.length < 100) {
          hasMorePages = false;
        }
        
        allRepos = [...allRepos, ...repos];
        page++;
        
        // Safety check to prevent infinite loops
        if (page > 10) {
          hasMorePages = false;
          console.warn('Reached maximum page count (10) when fetching GitHub repositories');
        }
      }
      
      // Filter out forked repositories
      return allRepos.filter(repo => !repo.fork);
    } catch (error) {
      console.error('Failed to fetch GitHub repositories:', error);
      return [];
    }
  });
}
