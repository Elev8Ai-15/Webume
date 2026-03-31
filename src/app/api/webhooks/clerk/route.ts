import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    if (!email) return new Response("No email", { status: 400 });

    const name =
      [first_name, last_name].filter(Boolean).join(" ") || "User";
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Find unique slug, retry on constraint violation
    let slug = baseSlug;
    let counter = 1;
    while (await db.user.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    try {
      await db.user.create({
        data: {
          clerkId: id,
          email,
          name,
          slug,
          subscription: { create: { planId: "free", status: "active" } },
          settings: { create: {} },
        },
      });
    } catch (error: unknown) {
      // Handle race condition on slug uniqueness
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        slug = `${baseSlug}-${Date.now()}`;
        await db.user.create({
          data: {
            clerkId: id,
            email,
            name,
            slug,
            subscription: { create: { planId: "free", status: "active" } },
            settings: { create: {} },
          },
        });
      } else {
        throw error;
      }
    }
  }

  if (evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name =
      [first_name, last_name].filter(Boolean).join(" ") || undefined;

    await db.user
      .update({
        where: { clerkId: id },
        data: {
          ...(email && { email }),
          ...(name && { name }),
        },
      })
      .catch(() => {
        // User may not exist in our DB yet
      });
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await db.user.delete({ where: { clerkId: id } }).catch(() => {
        // User may not exist in our DB
      });
    }
  }

  return new Response("OK", { status: 200 });
}
