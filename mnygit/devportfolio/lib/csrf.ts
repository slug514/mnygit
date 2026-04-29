import { doubleCsrf } from "csrf-csrf";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// __Host- prefix requires Secure + HTTPS — use plain name in dev
const isDev = process.env.NODE_ENV !== "production";
const COOKIE_NAME = isDev ? "x-csrf-token" : "__Host-psifi.x-csrf-token";

const { generateCsrfToken, validateRequest } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET ?? "dev-fallback-replace-in-prod",
  getSessionIdentifier: () => "",
  cookieName: COOKIE_NAME,
  cookieOptions: {
    sameSite: "strict",
    secure: !isDev,
    httpOnly: true,
    path: "/",
  },
  size: 64,
  // Read token from X-CSRF-Token header (Web API Headers or plain object)
  getCsrfTokenFromRequest: (req: any) =>
    typeof req.headers?.get === "function"
      ? (req.headers.get("x-csrf-token") ?? "")
      : (req.headers?.["x-csrf-token"] ?? ""),
});

// ── Adapters: translate NextRequest / NextResponse ↔ Express-style ──

function toExpressReq(req: NextRequest) {
  const cookies: Record<string, string> = {};
  req.cookies.getAll().forEach(({ name, value }) => { cookies[name] = value; });
  return {
    method: req.method,
    cookies,
    headers: {
      "x-csrf-token": req.headers.get("x-csrf-token") ?? "",
    },
  };
}

function makeExpressRes() {
  const pending: Array<{ name: string; value: string; opts: Record<string, unknown> }> = [];
  const expressRes = {
    cookie(name: string, value: string, opts: Record<string, unknown>) {
      pending.push({ name, value, opts });
    },
  };
  function apply(response: NextResponse) {
    pending.forEach(({ name, value, opts }) =>
      response.cookies.set({ name, value, ...(opts as any) })
    );
  }
  return { expressRes, apply };
}

// ── Public API ──

export function generateCsrfTokenForNextJs(req: NextRequest): NextResponse {
  const expressReq = toExpressReq(req);
  const { expressRes, apply } = makeExpressRes();
  const token = generateCsrfToken(expressReq as any, expressRes as any);
  const response = NextResponse.json({ csrfToken: token });
  apply(response);
  return response;
}

export function validateCsrfToken(req: NextRequest): boolean {
  // Server-side calls (no Origin header) are not browser-originating — skip CSRF
  if (!req.headers.get("origin")) return true;
  try {
    return validateRequest(toExpressReq(req) as any);
  } catch {
    return false;
  }
}
