import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { createUserFromClerk } from "@/lib/repositories/user.repository";

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

  // Signature verification must use the original bytes, not reserialized JSON.
  const body = await req.text();

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

    const name = [first_name, last_name].filter(Boolean).join(" ") || "User";
    // ensureUser (app layout) may have created the row already.
    const exists = await db.user.findUnique({ where: { clerkId: id } });
    if (!exists) await createUserFromClerk({ clerkId: id, email, name });
  }

  if (evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ") || undefined;

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
