"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PLANS } from "@/lib/stripe/plans";
import type { ActionState } from "@/lib/types/actions";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  // Dynamic import to avoid bundling Stripe on client
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require("stripe") as typeof import("stripe").default;
  return new Stripe(key);
}

export async function createCheckoutSession(
  planId: string,
): Promise<ActionState<{ url: string }>> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const plan = PLANS[planId];
  if (!plan?.priceId) {
    return { success: false, error: "Invalid plan" };
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { subscription: true },
  });
  if (!user) return { success: false, error: "User not found" };

  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://youthful-lalande.vercel.app"}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://youthful-lalande.vercel.app"}/pricing`,
    client_reference_id: user.id,
    customer_email: user.email,
    metadata: { userId: user.id, planId },
  });

  if (!session.url) {
    return { success: false, error: "Failed to create checkout session" };
  }

  return { success: true, data: { url: session.url } };
}

export async function cancelSubscription(): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { subscription: true },
  });

  if (!user?.subscription?.stripeSubscriptionId) {
    return { success: false, error: "No active subscription" };
  }

  const stripe = getStripe();

  await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await db.subscription.update({
    where: { userId: user.id },
    data: { status: "cancelled", cancelledAt: new Date() },
  });

  return { success: true, data: undefined };
}
