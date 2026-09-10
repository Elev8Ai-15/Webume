"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { PLANS } from "@/lib/stripe/plans";
import { getStripe } from "@/lib/stripe/client";
import { syncStripeSubscription } from "@/lib/stripe/sync";
import type { ActionState } from "@/lib/types/actions";

export async function createCheckoutSession(
  planId: string,
): Promise<ActionState<{ url: string }>> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };
  if (planId !== "pro") return { success: false, error: "Invalid plan" };
  const plan = PLANS.pro;
  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!process.env.STRIPE_SECRET_KEY || !priceId || !plan)
    return {
      success: false,
      error:
        "Pro checkout isn't open yet. Your free profile and link stay free forever.",
    };
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return { success: false, error: "App URL not configured" };
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { subscription: true },
  });
  if (!user) return { success: false, error: "User not found" };
  if (
    user.subscription?.stripeSubscriptionId &&
    !["canceled", "cancelled", "incomplete_expired"].includes(
      user.subscription.status,
    )
  )
    return {
      success: false,
      error:
        "You already have a subscription. Use Manage billing to update it.",
    };
  const checkoutHour = Math.floor(Date.now() / 3600000);
  try {
    const session = await getStripe().checkout.sessions.create(
      {
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/pricing?checkout=complete`,
        cancel_url: `${appUrl}/pricing`,
        client_reference_id: user.id,
        ...(user.subscription?.stripeCustomerId
          ? { customer: user.subscription.stripeCustomerId }
          : { customer_email: user.email }),
        metadata: { userId: user.id, planId },
        subscription_data: { metadata: { userId: user.id } },
        expires_at: (checkoutHour + 2) * 3600,
      },
      {
        idempotencyKey: `careerory-checkout-${user.id}-${planId}-${checkoutHour}`,
      },
    );
    if (!session.url) throw new Error("No checkout URL");
    return { success: true, data: { url: session.url } };
  } catch {
    return {
      success: false,
      error: "Checkout is unavailable. Please try again shortly.",
    };
  }
}

export async function createBillingPortal(): Promise<
  ActionState<{ url: string }>
> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { subscription: true },
  });
  if (!user?.subscription?.stripeCustomerId || !process.env.NEXT_PUBLIC_APP_URL)
    return { success: false, error: "No billing account is available yet." };
  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });
    return { success: true, data: { url: session.url } };
  } catch {
    return {
      success: false,
      error: "Billing management is unavailable. Please try again shortly.",
    };
  }
}

export async function cancelSubscription(): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { subscription: true },
  });
  if (!user?.subscription?.stripeSubscriptionId)
    return { success: false, error: "No active subscription" };
  try {
    await getStripe().subscriptions.update(
      user.subscription.stripeSubscriptionId,
      { cancel_at_period_end: true },
    );
    await syncStripeSubscription(
      user.subscription.stripeSubscriptionId,
      user.id,
    );
    revalidatePath("/pricing");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error:
        "Cancellation could not be confirmed. Check Manage billing before trying again.",
    };
  }
}
