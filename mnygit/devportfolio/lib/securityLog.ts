type SecurityEvent =
  | "RATE_LIMIT_HIT"
  | "INVALID_INPUT"
  | "BLOCKED_USER_AGENT"
  | "PATH_TRAVERSAL"
  | "OVERSIZED_PAYLOAD"
  | "CSRF_VIOLATION";

interface EventDetails {
  ip?: string;
  path?: string;
  userAgent?: string;
  extra?: string;
}

export function logSecurityEvent(event: SecurityEvent, details: EventDetails): void {
  console.warn(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      type: "SECURITY_EVENT",
      event,
      ...details,
    })
  );
}
