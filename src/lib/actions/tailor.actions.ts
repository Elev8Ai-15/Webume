"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { tailorResumeWithAI } from "@/lib/ai/tailor-resume";
import { isPremiumUser } from "@/lib/stripe/plans";
import { getProfileByClerkId } from "@/lib/profile/profile.service";
import type { ActionState } from "@/lib/types/actions";
import type { TailorResult } from "@/lib/ai/tailor-resume";

export async function tailorResume(
  jobTitle: string,
  company: string,
  jobDescription: string,
  jobUrl?: string,
): Promise<ActionState<TailorResult>> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const result0 = await getProfileByClerkId(userId);
  if (!result0) return { success: false, error: "User not found" };
  const { user, profileData } = result0;

  if (!isPremiumUser(user.subscription)) {
    return { success: false, error: "Premium subscription required" };
  }

  if (!profileData) {
    return { success: false, error: "Upload a resume first" };
  }

  const input = z
    .object({
      jobTitle: z.string().trim().min(1).max(200),
      company: z.string().trim().min(1).max(200),
      jobDescription: z.string().trim().min(20).max(20000),
      jobUrl: z
        .union([z.url({ protocol: /^https?$/ }), z.literal("")])
        .optional(),
    })
    .safeParse({ jobTitle, company, jobDescription, jobUrl });
  if (!input.success)
    return {
      success: false,
      error:
        "Add a job title, company, and job description (20–20,000 characters), with a valid job URL if provided.",
    };

  try {
    const result = await tailorResumeWithAI(
      profileData,
      jobTitle,
      company,
      jobDescription,
    );

    // Save tailored resume to DB
    await db.tailoredResume.create({
      data: {
        userId: user.id,
        jobTitle,
        company,
        jobUrl: jobUrl ?? null,
        profileData: JSON.parse(JSON.stringify(result)),
        matchScore: result.matchAnalysis.overallScore,
      },
    });

    revalidatePath("/tailor");

    return { success: true, data: result };
  } catch (error) {
    console.error("Tailor error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to tailor resume",
    };
  }
}
