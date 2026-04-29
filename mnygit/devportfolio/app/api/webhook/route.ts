import crypto from "crypto";
import { logSecurityEvent } from "@/lib/securityLog";
import { saveProUser } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-signature");

  if (!signature) {
    logSecurityEvent("CSRF_VIOLATION", {
      extra: "Missing Lemon Squeezy webhook signature",
    });
    return new Response("Unauthorized", { status: 401 });
  }

  const hmac = crypto
    .createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (hmac !== signature) {
    logSecurityEvent("CSRF_VIOLATION", {
      extra: "Invalid Lemon Squeezy webhook signature",
    });
    return new Response("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(body);
  const eventName = payload.meta?.event_name;

  if (eventName === "order_created") {
    const username = payload.meta?.custom_data?.username;
    const email = payload.data?.attributes?.user_email;
    const orderId = payload.data?.id?.toString();
    const status = payload.data?.attributes?.status;

    if (status === "paid" && username && orderId) {
      const saved = await saveProUser({ username, email, orderId });

      if (saved) {
        console.log(
          `[PAYMENT SUCCESS] username: ${username}, email: ${email}, order: ${orderId}`
        );
      } else {
        console.error(`[PAYMENT FAILED TO SAVE] username: ${username}, order: ${orderId}`);
      }
    }
  }

  return new Response("OK", { status: 200 });
}

export const runtime = "nodejs";
