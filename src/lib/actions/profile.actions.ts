"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { VALID_TEMPLATES } from "@/lib/types/profile";
import type { ActionState } from "@/lib/types/actions";
import type { ProfileData, TemplateId } from "@/lib/types/profile";

export async function updateProfileData(
  data: Partial<ProfileData>,
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "User not found" };

  // Experiences live as relational rows now — this action patches header
  // fields only (basics, skills, achievements, education, certifications).
  const { experience: _experience, ...headerPatch } = data;
  const existing = (user.profileData as unknown as ProfileData | null) ?? {};
  const merged = { ...existing, ...headerPatch };

  await db.user.update({
    where: { clerkId: userId },
    data: { profileData: JSON.parse(JSON.stringify(merged)) },
  });

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  if (user.slug) revalidatePath(`/p/${user.slug}`);

  return { success: true, data: undefined };
}

export async function updateTemplate(
  templateId: TemplateId,
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  if (!VALID_TEMPLATES.includes(templateId)) {
    return { success: false, error: "Invalid template" };
  }

  const user = await db.user.update({
    where: { clerkId: userId },
    data: { selectedTemplate: templateId },
  });

  if (user.slug) revalidatePath(`/p/${user.slug}`);
  revalidatePath("/profile");

  return { success: true, data: undefined };
}

export async function togglePublic(
  isPublic: boolean,
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  await db.user.update({
    where: { clerkId: userId },
    data: { isPublic },
  });

  revalidatePath("/dashboard");
  revalidatePath("/settings");

  return { success: true, data: undefined };
}
