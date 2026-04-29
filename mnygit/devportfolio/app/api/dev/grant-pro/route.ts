// IMPORTANT: DELETE THIS FILE BEFORE GOING TO PRODUCTION
// Only for local development testing of Pro status flow

import { saveProUser } from "@/lib/supabase";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const { username, orderId } = await request.json();

  if (!username) {
    return Response.json({ error: "username required" }, { status: 400 });
  }

  const saved = await saveProUser({
    username,
    email: "test@devportfolio.dev",
    orderId: orderId ?? `test_${Date.now()}`,
  });

  return Response.json({ success: saved });
}
