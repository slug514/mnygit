import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
});

export async function createProCheckout(
  username: string,
  email?: string
): Promise<string | undefined> {
  const checkout = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID!,
    process.env.LEMONSQUEEZY_VARIANT_ID!,
    {
      checkoutData: {
        email: email || undefined,
        custom: {
          username,
        },
      },
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
      },
      productOptions: {
        name: "DevPortfolio Quick — Pro",
        description:
          "Remove branding, PDF export, priority AI generation. Lifetime access.",
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success?username=${username}`,
        receiptButtonText: "View My Portfolio",
        receiptThankYouNote: "Welcome to Pro! Your portfolio is ready.",
      },
    }
  );

  return checkout.data?.data.attributes.url;
}
