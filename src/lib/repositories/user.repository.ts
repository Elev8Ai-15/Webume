import { db } from "@/lib/db";

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
