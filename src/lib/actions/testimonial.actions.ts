"use server";
import { randomBytes } from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/types/actions";
const TOKEN = /^[a-f0-9]{64}$/;
const WEEK = 7 * 24 * 60 * 60 * 1000;
const responseSchema = z.object({
  issuerName: z.string().trim().min(2).max(200),
  issuerEmail: z.email().max(200),
  relationship: z.enum([
    "Coworker",
    "Manager",
    "Direct report",
    "Client",
    "Professional collaborator",
  ]),
  sharedCompany: z.string().trim().max(200),
  body: z.string().trim().min(20).max(3000),
});
export type TestimonialResponse = z.infer<typeof responseSchema>;

export async function createTestimonialRequest(
  experienceId?: string,
): Promise<ActionState<{ token: string }>> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "User not found" };
  if (
    experienceId &&
    !(await db.experience.findFirst({
      where: { id: experienceId, userId: user.id },
    }))
  )
    return { success: false, error: "Choose one of your own career chapters." };
  const token = randomBytes(32).toString("hex");
  // Existing Testimonial rows double as one-use capability invitations.
  // Empty invitation content is never eligible for publication.
  await db.testimonial.create({
    data: {
      id: token,
      recipientId: user.id,
      experienceId: experienceId || null,
      issuerName: "",
      issuerEmail: "",
      relationship: "",
      body: "",
      status: "invited",
    },
  });
  revalidatePath("/testimonials");
  return { success: true, data: { token } };
}

export async function submitTestimonial(
  token: string,
  input: TestimonialResponse,
): Promise<ActionState> {
  if (!TOKEN.test(token))
    return { success: false, error: "This request link is invalid." };
  const parsed = responseSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error:
        "Enter your name, valid email, relationship, and a recommendation of 20–3,000 characters.",
    };
  // Compare-and-set prevents replay or overwriting a submitted/approved statement.
  const saved = await db.testimonial.updateMany({
    where: {
      id: token,
      status: "invited",
      createdAt: { gte: new Date(Date.now() - WEEK) },
    },
    data: { ...parsed.data, status: "pending", verificationLevel: 1 },
  });
  if (!saved.count)
    return {
      success: false,
      error:
        "This link has expired, was revoked, or has already been used. Ask for a new request link.",
    };
  revalidatePath("/testimonials");
  return { success: true, data: undefined };
}

export async function reviewTestimonial(
  id: string,
  status: "approved" | "rejected",
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };
  if (!["approved", "rejected"].includes(status))
    return { success: false, error: "Invalid review status" };
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "User not found" };
  const saved = await db.testimonial.updateMany({
    where: {
      id,
      recipientId: user.id,
      status: {
        in:
          status === "approved"
            ? ["pending", "rejected"]
            : ["invited", "pending", "approved"],
      },
      ...(status === "approved" ? { body: { not: "" } } : {}),
    },
    data: { status, approvedAt: status === "approved" ? new Date() : null },
  });
  if (!saved.count)
    return {
      success: false,
      error: "This recommendation cannot be changed. Refresh and try again.",
    };
  revalidatePath("/testimonials");
  revalidatePath("/profile");
  revalidatePath(`/p/${user.slug}`, "layout");
  return { success: true, data: undefined };
}
