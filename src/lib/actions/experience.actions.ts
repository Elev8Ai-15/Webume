"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/types/actions";
import type { User } from "@/generated/prisma/client";

const experienceInputSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(200),
  role: z.string().trim().min(1, "Role is required").max(200),
  startDate: z.string().trim().max(50).default(""),
  endDate: z.string().trim().max(50).default(""),
  description: z.string().trim().max(2000).default(""),
  responsibilities: z.array(z.string().trim().min(1).max(500)).max(50).default([]),
  metrics: z
    .array(
      z.object({
        value: z.string().trim().min(1).max(100),
        label: z.string().trim().min(1).max(200),
      }),
    )
    .max(20)
    .default([]),
});

export type ExperienceInput = z.input<typeof experienceInputSchema>;

async function requireUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  return db.user.findUnique({ where: { clerkId } });
}

function revalidateProfile(user: User) {
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  if (user.isPublic && user.slug) revalidatePath(`/p/${user.slug}`);
}

export async function createExperience(
  input: ExperienceInput,
): Promise<ActionState<{ id: string }>> {
  const user = await requireUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const parsed = experienceInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { metrics, ...fields } = parsed.data;

  const last = await db.experience.findFirst({
    where: { userId: user.id },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });

  const experience = await db.experience.create({
    data: {
      userId: user.id,
      ...fields,
      displayOrder: (last?.displayOrder ?? -1) + 1,
      metrics: { create: metrics },
    },
  });

  revalidateProfile(user);
  return { success: true, data: { id: experience.id } };
}

export async function updateExperience(
  id: string,
  input: ExperienceInput,
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const existing = await db.experience.findUnique({ where: { id } });
  if (!existing) return { success: false, error: "Not found" };
  if (existing.userId !== user.id) {
    return { success: false, error: "Not authorized" };
  }

  const parsed = experienceInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { metrics, ...fields } = parsed.data;

  await db.experience.update({
    where: { id },
    data: {
      ...fields,
      metrics: { deleteMany: {}, create: metrics },
    },
  });

  revalidateProfile(user);
  return { success: true, data: undefined };
}

export async function deleteExperience(id: string): Promise<ActionState> {
  const user = await requireUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const existing = await db.experience.findUnique({ where: { id } });
  if (!existing) return { success: false, error: "Not found" };
  if (existing.userId !== user.id) {
    return { success: false, error: "Not authorized" };
  }

  await db.experience.delete({ where: { id } });

  revalidateProfile(user);
  return { success: true, data: undefined };
}

export async function reorderExperiences(
  orderedIds: string[],
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const owned = await db.experience.findMany({
    where: { userId: user.id },
    select: { id: true },
  });
  const ownedIds = new Set(owned.map((e) => e.id));
  if (
    orderedIds.length !== ownedIds.size ||
    !orderedIds.every((id) => ownedIds.has(id))
  ) {
    return { success: false, error: "Invalid experience order" };
  }

  await db.$transaction(
    orderedIds.map((id, index) =>
      db.experience.update({
        where: { id },
        data: { displayOrder: index },
      }),
    ),
  );

  revalidateProfile(user);
  return { success: true, data: undefined };
}
