import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { stripeId, syncStripeSubscription } from "@/lib/stripe/sync";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET)
    return new Response("Billing is not configured", { status: 503 });
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      await req.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    let subscriptionId: string | undefined;
    let ownerHint: string | undefined;
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        if (session.mode !== "subscription") break;
        subscriptionId = stripeId(session.subscription);
        ownerHint = session.client_reference_id ?? session.metadata?.userId;
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        subscriptionId = event.data.object.id;
        break;
      case "invoice.paid":
      case "invoice.payment_failed":
        subscriptionId = stripeId(
          event.data.object.parent?.subscription_details?.subscription,
        );
        break;
    }
    if (subscriptionId) await syncStripeSubscription(subscriptionId, ownerHint);
    return new Response("OK", { status: 200 });
  } catch {
    // Stripe retries non-2xx deliveries. Never acknowledge a failed database sync.
    console.error("Stripe subscription sync failed", {
      eventId: event.id,
      type: event.type,
    });
    return new Response("Subscription sync failed", { status: 500 });
  }
}
