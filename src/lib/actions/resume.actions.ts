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
const ALLOWED_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

async function extractTextFromFile(file: File): Promise<string> {
  const type = file.type;

  if (type === "text/plain") {
    return file.text();
  }

  if (type === "application/pdf") {
    const pdfjs = await import("pdfjs-dist");
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) })
      .promise;

    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      pages.push(text);
    }
    return pages.join("\n\n");
  }

  // For DOCX, extract as plain text (basic approach)
  const text = await file.text();
  // Strip XML tags for basic DOCX text extraction
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

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
      error: "Unsupported file type. Please upload PDF, TXT, or DOCX.",
    };
  }

  try {
    // 1. Upload to Vercel Blob
    const blob = await put(`resumes/${userId}/${file.name}`, file, {
      access: "public",
    });

    // 2. Extract text from file
    const rawText = await extractTextFromFile(file);
    if (!rawText || rawText.trim().length < 50) {
      return {
        success: false,
        error: "Could not extract enough text from file. Try a different format.",
      };
    }

    // 3. AI parse
    const profileData = await parseResumeWithAI(rawText);

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
