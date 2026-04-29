// HTML entity encoding — prevents XSS when content is reflected in the DOM
export function sanitizeHTML(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
    .trim();
}

// Strip common SQL injection patterns.
// NOTE: this is defense-in-depth only. Parameterized queries
// (which Supabase uses by default) are the real protection.
export function sanitizeSQLInput(input: string): string {
  return input
    .replace(/['";\\]/g, "")
    .replace(/--/g, "")
    .replace(/\/\*/g, "")
    .replace(/xp_/gi, "")
    .replace(/\bUNION\b/gi, "")
    .replace(/\bSELECT\b/gi, "")
    .replace(/\bINSERT\b/gi, "")
    .replace(/\bUPDATE\b/gi, "")
    .replace(/\bDELETE\b/gi, "")
    .replace(/\bDROP\b/gi, "")
    .trim();
}

export function sanitizeUserInput(input: string): string {
  return sanitizeHTML(sanitizeSQLInput(input));
}
