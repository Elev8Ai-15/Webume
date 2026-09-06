import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

/** Create the DB row for a Clerk user. Shared by the Clerk webhook and ensureUser. */
export async function createUserFromClerk(input: {
  clerkId: string;
  email: string;
  name: string;
}) {
  const baseSlug =
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "user";
  let slug = baseSlug;
  let counter = 1;
  while (await db.user.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }
  const data = {
    ...input,
    slug,
    subscription: { create: { planId: "free", status: "active" } },
    settings: { create: {} },
  };
  try {
    return await db.user.create({ data });
  } catch (error: unknown) {
    // A webhook and the app layout can create the same Clerk user concurrently.
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      const existing = await db.user.findUnique({
        where: { clerkId: input.clerkId },
      });
      if (existing) return existing;
      return db.user.create({
        data: { ...data, slug: `${baseSlug}-${Date.now()}` },
      });
    }
    throw error;
  }
}

/**
 * Guarantee the signed-in Clerk user has a DB row. Runs in the (app) layout so
 * every action finds the user even if the Clerk webhook never fired.
 */
export async function ensureUser() {
  const cu = await currentUser();
  if (!cu) return null;
  const existing = await db.user.findUnique({ where: { clerkId: cu.id } });
  if (existing) return existing;
  const email =
    cu.primaryEmailAddress?.emailAddress ?? cu.emailAddresses[0]?.emailAddress;
  if (!email) return null;
  const name = [cu.firstName, cu.lastName].filter(Boolean).join(" ") || "User";
  return createUserFromClerk({ clerkId: cu.id, email, name });
}

export async function getUserByClerkId(clerkId: string) {
  return db.user.findUnique({
    where: { clerkId },
    include: { subscription: true, settings: true },
  });
}

export async function getUserBySlug(slug: string) {
  return db.user.findUnique({
    where: { slug },
    include: { subscription: true },
  });
}

export async function incrementProfileViews(slug: string) {
  await db.user.update({
    where: { slug },
    data: { profileViews: { increment: 1 }, lastViewedAt: new Date() },
  });
}
