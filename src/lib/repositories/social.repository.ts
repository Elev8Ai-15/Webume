import { db } from "@/lib/db";

export async function getEndorsementsForUser(userId: string) {
  return db.endorsement.findMany({
    where: { recipientId: userId },
    include: {
      author: { select: { id: true, name: true, slug: true, profilePhoto: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCommentsForUser(userId: string) {
  return db.comment.findMany({
    where: { recipientId: userId, approved: true },
    include: {
      author: { select: { id: true, name: true, slug: true, profilePhoto: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMediaForUser(userId: string) {
  return db.mediaAsset.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActivityForUser(userId: string) {
  return db.careerActivity.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
}
