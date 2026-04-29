import type { NextRequest } from "next/server";
import { enhanceDescriptions } from "@/lib/enhance";
import { portfolioLimiter, getIp, checkRateLimit } from "@/lib/ratelimit";
import { validateEnhanceRequest } from "@/lib/validate";
import { handleApiError } from "@/lib/errors";
import { validateCsrfToken } from "@/lib/csrf";
import { logSecurityEvent } from "@/lib/securityLog";

export async function POST(request: NextRequest) {
  try {
    // CSRF validation
    if (!validateCsrfToken(request)) {
      logSecurityEvent("CSRF_VIOLATION", {
        ip: getIp(request),
        path: "/api/enhance",
      });
      return Response.json({ error: "Invalid CSRF token." }, { status: 403 });
    }

    // Enforce Content-Type
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return Response.json({ error: "Content-Type must be application/json" }, { status: 415 });
    }

    // Rate limiting
    const ip = getIp(request);
    const allowed = await checkRateLimit(portfolioLimiter, ip);
    if (!allowed) {
      logSecurityEvent("RATE_LIMIT_HIT", { ip, path: "/api/enhance" });
      return Response.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    // Validate + sanitize input
    const body = await request.json();
    const { username, name, bio, repos } = validateEnhanceRequest(body);

    const enhanced = await enhanceDescriptions(username, name, bio, repos);
    return Response.json({ enhanced });
  } catch (err) {
    return handleApiError(err);
  }
}
