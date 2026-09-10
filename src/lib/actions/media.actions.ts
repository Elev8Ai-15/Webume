"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/types/actions";

async function requireAuthor() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  return db.user.findUnique({ where: { clerkId } });
}

// ---- MEDIA ASSETS ----

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

export async function uploadMediaAsset(
  formData: FormData,
): Promise<ActionState<{ id: string; url: string }>> {
  const author = await requireAuthor();
  if (!author) return { success: false, error: "Not authenticated" };

  const file = formData.get("file");
  const kind = (formData.get("kind") as string) || "other";
  const caption = formData.get("caption") as string | null;
  const experienceCompany = formData.get("experienceCompany") as string | null;
  const year = formData.get("year") as string | null;
  const experienceId = formData.get("experienceId");
  if (
    experienceId &&
    (typeof experienceId !== "string" ||
      !(await db.experience.findFirst({
        where: { id: experienceId, userId: author.id },
      })))
  )
    return { success: false, error: "Choose one of your own career chapters." };

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file provided" };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { success: false, error: "Image too large (max 4MB)" };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { success: false, error: "Only JPEG, PNG, WebP, or GIF allowed" };
  }

  const blob = await put(
    `gallery/${author.id}/${Date.now()}-${file.name}`,
    file,
    {
      access: "public",
    },
  );

  const asset = await db.mediaAsset.create({
    data: {
      userId: author.id,
      url: blob.url,
      kind,
      experienceId:
        typeof experienceId === "string" && experienceId ? experienceId : null,
      caption: caption?.trim() || null,
      experienceCompany: experienceCompany?.trim() || null,
      year: year?.trim() || null,
    },
  });

  revalidatePath("/gallery");
  if (author.slug) revalidatePath(`/p/${author.slug}`, "layout");
  return { success: true, data: { id: asset.id, url: blob.url } };
}

export async function deleteMediaAsset(assetId: string): Promise<ActionState> {
  const author = await requireAuthor();
  if (!author) return { success: false, error: "Not authenticated" };

  const asset = await db.mediaAsset.findUnique({ where: { id: assetId } });
  if (!asset) return { success: false, error: "Not found" };
  if (asset.userId !== author.id)
    return { success: false, error: "Not authorized" };

  await db.mediaAsset.delete({ where: { id: assetId } });
  revalidatePath("/gallery");
  if (author.slug) revalidatePath(`/p/${author.slug}`, "layout");
  return { success: true, data: undefined };
}

