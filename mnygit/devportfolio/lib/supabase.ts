import { createClient } from "@supabase/supabase-js";

// Public client — safe for server components and client components
// Uses anon key, respects Row Level Security policies
// cache: 'no-store' prevents Next.js from caching Supabase fetch responses —
// without this, isPro stays false after a purchase until the cache expires.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options = {}) =>
        fetch(url, { ...options, cache: "no-store" }),
    },
  }
);

// Admin client — server-side only (webhook, API routes)
// Uses service role key, bypasses RLS
// Never import this in client components
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function isUserPro(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("pro_users")
    .select("id")
    .eq("username", username.toLowerCase())
    .single();

  if (error || !data) return false;
  return true;
}

export async function saveProUser(params: {
  username: string;
  email?: string;
  orderId: string;
}): Promise<boolean> {
  const { error } = await supabaseAdmin.from("pro_users").upsert(
    {
      username: params.username.toLowerCase(),
      email: params.email ?? null,
      order_id: params.orderId,
    },
    { onConflict: "order_id" }
  );

  if (error) {
    console.error("[Supabase] Failed to save pro user:", error.message);
    return false;
  }
  return true;
}
