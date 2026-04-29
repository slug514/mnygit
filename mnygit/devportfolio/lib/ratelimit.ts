import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function makeRatelimit(requests: number, window: `${number} s`) {
  // Fail open if Upstash credentials are not configured
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: false,
  });
}

// 10 req / 60s — for /api/github and /api/enhance
export const portfolioLimiter = makeRatelimit(10, "60 s");

// 3 req / 60s — for payment endpoints
export const strictLimiter = makeRatelimit(3, "60 s");

export function getIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}

export async function checkRateLimit(
  limiter: ReturnType<typeof makeRatelimit>,
  ip: string
): Promise<boolean> {
  if (!limiter) return true; // fail open in dev
  const { success } = await limiter.limit(ip);
  return success;
}
