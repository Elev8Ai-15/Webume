"use server";

import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { parseResumeWithAI } from "@/lib/ai/parse-resume";
import { saveParsedProfile } from "@/lib/profile/profile.service";
import type { ActionState } from "@/lib/types/actions";
import type { ProfileData } from "@/lib/types/profile";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// ponytail: DOCX cut for v1 — regex tag-stripping on zipped XML produced
// garbage; add mammoth-based parsing at Gate B if users ask for it.
const ALLOWED_TYPES = ["application/pdf", "text/plain"];

export async function uploadAndParseResume(
  formData: FormData,
): Promise<ActionState<{ profileData: ProfileData }>> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const file = formData.get("resume") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "File too large (max 5MB)" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Unsupported file type. Please upload a PDF or TXT file.",
    };
  }

  try {
    // 1. Upload to Vercel Blob
    const blob = await put(`resumes/${userId}/${file.name}`, file, {
      access: "public",
    });

    // 2. AI parse. PDFs go to Claude as-is (it reads PDF natively); TXT as text.
    const rawText = file.type === "text/plain" ? await file.text() : "";
    if (file.type === "text/plain" && rawText.trim().length < 50) {
      return { success: false, error: "That text file is nearly empty. Try a different file." };
    }
    const profileData = await parseResumeWithAI(
      file.type === "application/pdf"
        ? { pdf: new Uint8Array(await file.arrayBuffer()) }
        : { text: rawText },
    );

    // 4. Save header JSON + relational Experience rows
    await saveParsedProfile(user.id, profileData, {
      rawText,
      resumeUrl: blob.url,
    });

    // 5. Revalidate
    revalidatePath("/dashboard");
    revalidatePath("/resume");
    revalidatePath("/profile");

    return { success: true, data: { profileData } };
  } catch (error) {
    console.error("Resume upload/parse error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process resume. Please try again.",
    };
  }
}
