"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/types/actions";
const schema = z.object({
  experienceId: z.string().min(1),
  title: z.string().trim().min(1).max(200),
  url: z.url({ protocol: /^https?$/ }).max(2000),
  kind: z.enum([
    "award",
    "certification",
    "recommendation",
    "project",
    "other",
  ]),
  year: z.string().trim().max(50),
});
export type DocumentInput = z.infer<typeof schema>;
export async function addDocument(input: DocumentInput): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };
  const parsed = schema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error:
        "Choose a chapter and provide a title and valid HTTP or HTTPS sharing link.",
    };
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "User not found" };
  if (
    !(await db.experience.findFirst({
      where: { id: parsed.data.experienceId, userId: user.id },
    }))
  )
    return { success: false, error: "Choose one of your own career chapters." };
  await db.document.create({ data: { ...parsed.data, userId: user.id } });
  revalidatePath("/profile/edit");
  revalidatePath("/profile", "layout");
  revalidatePath(`/p/${user.slug}`, "layout");
  return { success: true, data: undefined };
}
export async function removeDocument(id: string): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "User not found" };
  const result = await db.document.deleteMany({
    where: { id, userId: user.id },
  });
  if (!result.count) return { success: false, error: "Document not found" };
  revalidatePath("/profile/edit");
  revalidatePath("/profile", "layout");
  revalidatePath(`/p/${user.slug}`, "layout");
  return { success: true, data: undefined };
}
