"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/types/actions";
const inputSchema = z.object({
  education: z
    .array(
      z.object({
        degree: z.string().trim().min(1).max(200),
        school: z.string().trim().min(1).max(200),
        year: z.string().trim().max(50),
        details: z.string().trim().max(1000),
      }),
    )
    .max(30),
  certifications: z.array(z.string().trim().min(1).max(300)).max(100),
  achievements: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(200),
        description: z.string().trim().max(2000),
      }),
    )
    .max(50),
});
export type QualificationsInput = z.infer<typeof inputSchema>;
export async function updateQualifications(
  input: QualificationsInput,
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error:
        "Complete the qualification fields and keep descriptions within the stated limits.",
    };
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (
    !user?.profileData ||
    typeof user.profileData !== "object" ||
    Array.isArray(user.profileData)
  )
    return {
      success: false,
      error: "Save your name and profile details first.",
    };
  await db.user.update({
    where: { id: user.id },
    data: { profileData: { ...user.profileData, ...parsed.data } },
  });
  for (const path of [
    "/profile",
    "/profile/edit",
    "/dashboard",
    `/p/${user.slug}`,
  ])
    revalidatePath(path);
  return { success: true, data: undefined };
}
