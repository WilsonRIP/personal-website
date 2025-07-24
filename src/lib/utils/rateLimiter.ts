// utils/rateLimiter.ts
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  /**
   * @param capacity   Maximum requests per interval (default 45)
   * @param interval   Refill interval in ms (default 60 000)
   * @param minGap     Minimum ms between calls (default 300)
   */
  constructor(
    private readonly capacity = 45,
    private readonly interval = 60_000,
    private readonly minGap = 300
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  /** Refill the bucket if the interval has passed. */
  private refill() {
    const now = Date.now();
    if (now - this.lastRefill >= this.interval) {
      this.tokens = this.capacity;
      this.lastRefill = now;
    }
  }

  /** 
   * Wait until a token is available, then consume one, 
   * and ensure at least `minGap` ms since last call. 
   */
  async acquire(): Promise<void> {
    this.refill();

    if (this.tokens <= 0) {
      // wait for the next refill
      const waitTime = this.interval - (Date.now() - this.lastRefill);
      await delay(waitTime);
      this.refill();
    }

    this.tokens--;
    // enforce a small gap between consecutive calls
    await delay(this.minGap);
  }
}
