import { type NextRequest } from "next/server";
import { createProCheckout } from "@/lib/lemonsqueezy";
import { validateUsername } from "@/lib/validate";
import { handleApiError } from "@/lib/errors";
import { validateCsrfToken } from "@/lib/csrf";
import { strictLimiter, getIp, checkRateLimit } from "@/lib/ratelimit";
import { logSecurityEvent } from "@/lib/securityLog";

export async function POST(request: NextRequest) {
  try {
    // CSRF validation
    if (!validateCsrfToken(request)) {
      logSecurityEvent("CSRF_VIOLATION", {
        ip: getIp(request),
        path: "/api/checkout",
      });
      return Response.json({ error: "Invalid CSRF token." }, { status: 403 });
    }

    // Rate limiting
    const ip = getIp(request);
    const allowed = await checkRateLimit(strictLimiter, ip);
    if (!allowed) {
      logSecurityEvent("RATE_LIMIT_HIT", { ip, path: "/api/checkout" });
      return Response.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const username = validateUsername(body.username ?? "");
    const email =
      typeof body.email === "string" ? body.email.trim() || undefined : undefined;

    const checkoutUrl = await createProCheckout(username, email);

    if (!checkoutUrl) {
      throw new Error("Failed to create checkout session");
    }

    return Response.json({ url: checkoutUrl });
  } catch (error) {
    return handleApiError(error);
  }
}
