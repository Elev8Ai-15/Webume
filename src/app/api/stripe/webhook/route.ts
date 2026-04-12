import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Missing signature or secret", { status: 400 });
  }

  let event;
  try {
    // Dynamic import to avoid bundling
    const Stripe =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("stripe") as typeof import("stripe").default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;

      if (userId && planId) {
        await db.subscription.upsert({
          where: { userId },
          update: {
            planId,
            status: "active",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            startedAt: new Date(),
            cancelledAt: null,
          },
          create: {
            userId,
            planId,
            status: "active",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const sub = await db.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });
      if (sub) {
        await db.subscription.update({
          where: { id: sub.id },
          data: { planId: "free", status: "cancelled", cancelledAt: new Date() },
        });
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const sub = await db.subscription.findFirst({
        where: { stripeCustomerId: invoice.customer as string },
      });
      if (sub) {
        await db.subscription.update({
          where: { id: sub.id },
          data: { status: "past_due" },
        });
      }
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
