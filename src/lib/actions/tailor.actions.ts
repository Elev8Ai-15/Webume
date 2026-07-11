"use server";

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

  if (!isPremiumUser(user.subscription?.planId ?? "free")) {
    return { success: false, error: "Premium subscription required" };
  }

  if (!profileData) {
    return { success: false, error: "Upload a resume first" };
  }

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
