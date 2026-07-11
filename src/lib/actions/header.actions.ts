"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/types/actions";
import type { ProfileData } from "@/lib/types/profile";

const headerInputSchema = z.object({
  basics: z.object({
    name: z.string().trim().min(1, "Name is required").max(200),
    title: z.string().trim().max(200).default(""),
    tagline: z.string().trim().max(300).default(""),
    summary: z.string().trim().max(2000).default(""),
    location: z.string().trim().max(200).default(""),
    phone: z.string().trim().max(50).default(""),
    email: z.string().trim().max(200).default(""),
    linkedin: z.string().trim().max(300).default(""),
    website: z.string().trim().max(300).default(""),
  }),
  skills: z.array(z.string().trim().min(1).max(100)).max(100).default([]),
});

export type HeaderInput = z.input<typeof headerInputSchema>;

// Header data that stays on User.profileData after the relational split.
type ProfileHeader = Omit<ProfileData, "experience">;

export async function updateHeader(input: HeaderInput): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "User not found" };

  const parsed = headerInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Merge into the existing header; a manual-first user with no profileData
  // gets a fresh header so hasProfile (!!user.profileData) flips true.
  const existing =
    (user.profileData as unknown as Partial<ProfileHeader> | null) ?? {};
  const merged: ProfileHeader = {
    basics: parsed.data.basics,
    skills: parsed.data.skills,
    achievements: existing.achievements ?? [],
    education: existing.education ?? [],
    certifications: existing.certifications ?? [],
  };

  await db.user.update({
    where: { id: user.id },
    data: { profileData: JSON.parse(JSON.stringify(merged)) },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  if (user.isPublic && user.slug) revalidatePath(`/p/${user.slug}`);

  return { success: true, data: undefined };
}
