"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/types/actions";

import { MILESTONE_KINDS } from "@/lib/milestone-kinds";

async function requireOwner() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  return db.user.findUnique({ where: { clerkId } });
}

function revalidate(slug: string | null) {
  revalidatePath("/milestones");
  if (slug) revalidatePath(`/p/${slug}`, "layout");
}

export async function addMilestone(
  kind: string,
  title: string,
  description: string | null,
  date: string,
  experienceId: string | null,
): Promise<ActionState> {
  const owner = await requireOwner();
  if (!owner) return { success: false, error: "Not authenticated" };
  if (!(kind in MILESTONE_KINDS))
    return { success: false, error: "Invalid milestone kind" };
  if (!title.trim() || title.length > 200)
    return { success: false, error: "Title required (max 200 characters)" };
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime()))
    return { success: false, error: "Invalid date" };
  if (experienceId) {
    const job = await db.experience.findFirst({
      where: { id: experienceId, userId: owner.id },
      select: { id: true },
    });
    if (!job) return { success: false, error: "That job is not yours" };
  }

  await db.careerActivity.create({
    data: {
      userId: owner.id,
      experienceId: experienceId || null,
      kind,
      title: title.trim(),
      description: description?.trim().slice(0, 2000) || null,
      date: parsedDate,
    },
  });
  revalidate(owner.slug);
  return { success: true, data: undefined };
}

export async function deleteMilestone(id: string): Promise<ActionState> {
  const owner = await requireOwner();
  if (!owner) return { success: false, error: "Not authenticated" };
  const { count } = await db.careerActivity.deleteMany({
    where: { id, userId: owner.id },
  });
  if (count === 0) return { success: false, error: "Not found" };
  revalidate(owner.slug);
  return { success: true, data: undefined };
}
