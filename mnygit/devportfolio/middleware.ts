import { type NextRequest, NextResponse } from "next/server";

const MAX_BODY_SIZE = 64 * 1024; // 64KB

const BLOCKED_USER_AGENTS = [
  "sqlmap",
  "nikto",
  "nmap",
  "masscan",
  "zgrab",
  "dirbuster",
  "nuclei",
  "acunetix",
  "nessus",
  "burpsuite",
  "w3af",
  "openvas",
];

// x-forwarded-host is intentionally excluded: Next.js dev server sets it on every
// request before middleware runs. x-original-url and x-rewrite-url are IIS/proxy
// URL-rewriting headers that have no legitimate use in this app.
const SUSPICIOUS_HEADERS = [
  "x-original-url",
  "x-rewrite-url",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply security checks to /api routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Block oversized payloads
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return NextResponse.json(
      { error: "Payload too large." },
      { status: 413 }
    );
  }

  // Block known malicious user agents
  const ua = (request.headers.get("user-agent") ?? "").toLowerCase();
  if (BLOCKED_USER_AGENTS.some((bad) => ua.includes(bad))) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // Block requests with request-smuggling / host-override headers
  for (const header of SUSPICIOUS_HEADERS) {
    if (request.headers.has(header)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
  }

  // Block path traversal in URL
  const rawPath = decodeURIComponent(pathname);
  if (rawPath.includes("../") || rawPath.includes("..\\") || rawPath.includes("%2e%2e")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // Attach a unique request ID for log correlation
  const requestId = crypto.randomUUID();
  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
