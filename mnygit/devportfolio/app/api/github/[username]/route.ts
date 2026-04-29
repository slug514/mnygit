import { type NextRequest, NextResponse } from "next/server";
import { fetchGitHubProfile, GitHubError } from "@/lib/github";
import { portfolioLimiter, getIp, checkRateLimit } from "@/lib/ratelimit";
import { validateUsername } from "@/lib/validate";
import { handleApiError } from "@/lib/errors";
import { logSecurityEvent } from "@/lib/securityLog";

const BLOCKED_USERNAMES = new Set(["admin", "root", "test", "null", "undefined"]);

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const ip = getIp(request);

  try {
    // Rate limiting
    const allowed = await checkRateLimit(portfolioLimiter, ip);
    if (!allowed) {
      logSecurityEvent("RATE_LIMIT_HIT", { ip, path: `/api/github/${params.username}` });
      return Response.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    // Input validation + path traversal check
    let username: string;
    try {
      username = validateUsername(params.username);
    } catch {
      logSecurityEvent("PATH_TRAVERSAL", { ip, path: params.username });
      return Response.json({ error: "Invalid username." }, { status: 400 });
    }

    if (BLOCKED_USERNAMES.has(username.toLowerCase())) {
      logSecurityEvent("INVALID_INPUT", { ip, path: username });
      return Response.json(
        { error: "Please enter a real GitHub username." },
        { status: 400 }
      );
    }

    const profile = await fetchGitHubProfile(username);
    return NextResponse.json(profile);
  } catch (err) {
    const ghErr = err as GitHubError;
    if (ghErr?.type === "not_found") {
      return Response.json({ error: "GitHub user not found." }, { status: 404 });
    }
    if (ghErr?.type === "rate_limit") {
      return Response.json(
        { error: "GitHub rate limit reached. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    return handleApiError(err);
  }
}
