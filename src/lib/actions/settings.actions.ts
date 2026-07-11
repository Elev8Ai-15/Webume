"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/types/actions";

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,38})[a-z0-9]$/;
const RESERVED_SLUGS = new Set([
  "api",
  "p",
  "sign-in",
  "sign-up",
  "dashboard",
  "settings",
  "admin",
  "pricing",
  "resume",
  "profile",
  "tailor",
  "ats",
  "gallery",
  "activity",
]);

export async function updateSlug(newSlug: string): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const slug = newSlug.trim().toLowerCase();

  if (!SLUG_PATTERN.test(slug)) {
    return {
      success: false,
      error:
        "Slug must be 3-40 characters: lowercase letters, numbers, and hyphens (no leading/trailing hyphen).",
    };
  }

  if (RESERVED_SLUGS.has(slug)) {
    return { success: false, error: "That slug is reserved. Try another." };
  }

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "User not found" };

  if (user.slug === slug) return { success: true, data: undefined };

  const taken = await db.user.findUnique({ where: { slug } });
  if (taken) {
    return { success: false, error: "That slug is already taken." };
  }

  const oldSlug = user.slug;
  await db.user.update({
    where: { clerkId: userId },
    data: { slug },
  });

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  if (oldSlug) revalidatePath(`/p/${oldSlug}`);
  revalidatePath(`/p/${slug}`);

  return { success: true, data: undefined };
}
