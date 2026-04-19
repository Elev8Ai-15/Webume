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

async function recipientFromSlug(slug: string) {
  return db.user.findUnique({ where: { slug } });
}

// ---- ENDORSEMENTS ----

export async function addEndorsement(
  recipientSlug: string,
  skill: string,
  message: string | null,
  experienceCompany: string | null,
): Promise<ActionState> {
  const author = await requireAuthor();
  if (!author) return { success: false, error: "Sign in to endorse" };

  const recipient = await recipientFromSlug(recipientSlug);
  if (!recipient) return { success: false, error: "Profile not found" };

  if (author.id === recipient.id) {
    return { success: false, error: "You can't endorse yourself" };
  }

  try {
    await db.endorsement.create({
      data: {
        authorId: author.id,
        recipientId: recipient.id,
        skill: skill.trim(),
        message: message?.trim() || null,
        experienceCompany: experienceCompany?.trim() || null,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        success: false,
        error: "You've already endorsed this person for this skill",
      };
    }
    throw error;
  }

  revalidatePath(`/p/${recipientSlug}`);
  return { success: true, data: undefined };
}

export async function removeEndorsement(
  endorsementId: string,
): Promise<ActionState> {
  const author = await requireAuthor();
  if (!author) return { success: false, error: "Not authenticated" };

  const endorsement = await db.endorsement.findUnique({
    where: { id: endorsementId },
    include: { recipient: true },
  });

  if (!endorsement) return { success: false, error: "Not found" };
  if (endorsement.authorId !== author.id) {
    return { success: false, error: "Not authorized" };
  }

  await db.endorsement.delete({ where: { id: endorsementId } });
  revalidatePath(`/p/${endorsement.recipient.slug}`);
  return { success: true, data: undefined };
}

// ---- COMMENTS ----

export async function addComment(
  recipientSlug: string,
  body: string,
  experienceCompany: string | null,
): Promise<ActionState> {
  const author = await requireAuthor();
  if (!author) return { success: false, error: "Sign in to comment" };

  const recipient = await recipientFromSlug(recipientSlug);
  if (!recipient) return { success: false, error: "Profile not found" };

  if (!body.trim() || body.trim().length < 3) {
    return { success: false, error: "Comment too short" };
  }

  if (body.length > 2000) {
    return { success: false, error: "Comment too long (max 2000 chars)" };
  }

  await db.comment.create({
    data: {
      authorId: author.id,
      recipientId: recipient.id,
      body: body.trim(),
      experienceCompany: experienceCompany?.trim() || null,
    },
  });

  revalidatePath(`/p/${recipientSlug}`);
  return { success: true, data: undefined };
}

export async function removeComment(commentId: string): Promise<ActionState> {
  const author = await requireAuthor();
  if (!author) return { success: false, error: "Not authenticated" };

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: { recipient: true },
  });
  if (!comment) return { success: false, error: "Not found" };

  // Author OR recipient can delete
  if (comment.authorId !== author.id && comment.recipientId !== author.id) {
    return { success: false, error: "Not authorized" };
  }

  await db.comment.delete({ where: { id: commentId } });
  revalidatePath(`/p/${comment.recipient.slug}`);
  return { success: true, data: undefined };
}

// ---- MEDIA ASSETS ----

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadMediaAsset(
  formData: FormData,
): Promise<ActionState<{ id: string; url: string }>> {
  const author = await requireAuthor();
  if (!author) return { success: false, error: "Not authenticated" };

  const file = formData.get("file") as File | null;
  const kind = (formData.get("kind") as string) || "other";
  const caption = formData.get("caption") as string | null;
  const experienceCompany = formData.get("experienceCompany") as string | null;
  const year = formData.get("year") as string | null;

  if (!file || file.size === 0) {
    return { success: false, error: "No file provided" };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { success: false, error: "Image too large (max 10MB)" };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { success: false, error: "Only JPEG, PNG, WebP, or GIF allowed" };
  }

  const blob = await put(`gallery/${author.id}/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  const asset = await db.mediaAsset.create({
    data: {
      userId: author.id,
      url: blob.url,
      kind,
      caption: caption?.trim() || null,
      experienceCompany: experienceCompany?.trim() || null,
      year: year?.trim() || null,
    },
  });

  revalidatePath("/gallery");
  if (author.slug) revalidatePath(`/p/${author.slug}`);
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
  if (author.slug) revalidatePath(`/p/${author.slug}`);
  return { success: true, data: undefined };
}

// ---- CAREER ACTIVITY ----

const VALID_ACTIVITY_KINDS = [
  "promotion",
  "review",
  "award",
  "project",
  "certification",
  "custom",
];

export async function addActivity(
  kind: string,
  title: string,
  description: string | null,
  date: string,
  experienceCompany: string | null,
): Promise<ActionState> {
  const author = await requireAuthor();
  if (!author) return { success: false, error: "Not authenticated" };

  if (!VALID_ACTIVITY_KINDS.includes(kind)) {
    return { success: false, error: "Invalid activity kind" };
  }
  if (!title.trim()) {
    return { success: false, error: "Title required" };
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return { success: false, error: "Invalid date" };
  }

  await db.careerActivity.create({
    data: {
      userId: author.id,
      kind,
      title: title.trim(),
      description: description?.trim() || null,
      date: parsedDate,
      experienceCompany: experienceCompany?.trim() || null,
    },
  });

  revalidatePath("/activity");
  if (author.slug) revalidatePath(`/p/${author.slug}`);
  return { success: true, data: undefined };
}

export async function deleteActivity(activityId: string): Promise<ActionState> {
  const author = await requireAuthor();
  if (!author) return { success: false, error: "Not authenticated" };

  const activity = await db.careerActivity.findUnique({
    where: { id: activityId },
  });
  if (!activity) return { success: false, error: "Not found" };
  if (activity.userId !== author.id)
    return { success: false, error: "Not authorized" };

  await db.careerActivity.delete({ where: { id: activityId } });
  revalidatePath("/activity");
  if (author.slug) revalidatePath(`/p/${author.slug}`);
  return { success: true, data: undefined };
}
