import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const purify = DOMPurify(new JSDOM("").window as any);

export function purifyString(dirty: string): string {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    FORBID_TAGS: ["script", "style", "iframe", "form", "object", "embed", "link"],
  });
}
