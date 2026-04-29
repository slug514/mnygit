import { type NextRequest } from "next/server";
import { generateCsrfTokenForNextJs } from "@/lib/csrf";

export async function GET(request: NextRequest) {
  return generateCsrfTokenForNextJs(request);
}
