// utils/fetchWithRetry.ts
import { RateLimiter } from './rateLimiter';

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Fetch with retries on 403 and network errors.
 * @param url        Full URL to fetch
 * @param options    fetch() options
 * @param limiter    RateLimiter instance
 * @param retries    Number of attempts (default 3)
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  limiter = new RateLimiter(),
  retries = 3
): Promise<Response> {
  let attempt = 0;

  while (true) {
    attempt++;
    await limiter.acquire();

    try {
      const res = await fetch(url, {
        ...options,
        next: { revalidate: 14_400 } // 4 h cache
      });

      // on 403, back off and retry
      if (res.status === 403 && attempt < retries) {
        const backoff = Math.pow(2, attempt) * 1_000; // 2 s, 4 s, 8 s…
        const jitter = Math.random() * 500;
        await delay(backoff + jitter);
        continue;
      }

      return res;
    } catch (err) {
      // network error — retry if we still can
      if (attempt >= retries) throw err;
      const backoff = Math.pow(2, attempt) * 1_000;
      const jitter = Math.random() * 500;
      await delay(backoff + jitter);
    }
  }
}
