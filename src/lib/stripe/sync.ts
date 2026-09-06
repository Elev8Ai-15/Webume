import type Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripe } from "./client";
import { planForStripePrice } from "./plans";

export function stripeId(value: string | { id: string } | null | undefined) {
  return typeof value === "string" ? value : value?.id;
}

export function subscriptionFields(sub: Stripe.Subscription) {
  const price = sub.items.data[0]?.price.id ?? "";
  const terminal = ["canceled", "incomplete_expired"].includes(sub.status);
  return {
    planId: terminal ? "free" : planForStripePrice(price),
    status: sub.status,
    stripeCustomerId: stripeId(sub.customer) ?? null,
    stripeSubscriptionId: sub.id,
    startedAt: new Date(sub.start_date * 1000),
    // Scheduled cancellation is distinct from losing access at period end.
    cancelledAt:
      sub.cancel_at_period_end && sub.canceled_at
        ? new Date(sub.canceled_at * 1000)
        : terminal
          ? new Date((sub.ended_at ?? sub.canceled_at ?? sub.created) * 1000)
          : null,
  };
}

/** Read the current subscription rather than trusting a potentially late event snapshot. */
export async function syncStripeSubscription(
  subscriptionId: string,
  ownerHint?: string,
) {
  const stripe = getStripe();
  const initial = await stripe.subscriptions.retrieve(subscriptionId);
  const linked = await db.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });
  const ownerId = linked?.userId ?? initial.metadata.userId ?? ownerHint;
  if (!ownerId) throw new Error("Subscription owner is missing");

  // Serialize per owner, including first-time webhook delivery. Re-read Stripe
  // after the lock, so concurrent/duplicate deliveries cannot apply an older snapshot.
  await db.$transaction(
    async (tx) => {
      const owners = await tx.$queryRaw<
        { id: string }[]
      >`SELECT id FROM "User" WHERE id = ${ownerId} FOR UPDATE`;
      if (!owners.length) throw new Error("Subscription owner not found");
      const existing = await tx.subscription.findUnique({
        where: { userId: ownerId },
      });
      if (
        existing?.stripeSubscriptionId &&
        existing.stripeSubscriptionId !== subscriptionId &&
        !["canceled", "cancelled", "incomplete_expired"].includes(
          existing.status,
        )
      ) {
        // A delayed event for another subscription must not replace the current one.
        return;
      }
      const current = await stripe.subscriptions.retrieve(subscriptionId);
      if (
        existing?.stripeCustomerId &&
        stripeId(current.customer) !== existing.stripeCustomerId
      )
        throw new Error("Customer mismatch");
      const data = subscriptionFields(current);
      await tx.subscription.upsert({
        where: { userId: ownerId },
        update: data,
        create: { userId: ownerId, ...data },
      });
    },
    { timeout: 30000 },
  );
}
