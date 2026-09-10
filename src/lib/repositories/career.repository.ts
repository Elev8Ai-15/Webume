import { db } from "@/lib/db";

export async function getMediaForUser(userId: string) {
  return db.mediaAsset.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMilestonesForUser(userId: string) {
  return db.careerActivity.findMany({
    where: { userId },
    include: { experience: { select: { id: true, company: true } } },
    orderBy: { date: "desc" },
  });
}

/** Only owner-approved testimonials may appear on the public portfolio. */
export async function getApprovedTestimonialsForUser(userId: string) {
  return db.testimonial.findMany({
    where: { recipientId: userId, status: "approved" },
    select: {
      id: true,
      issuerName: true,
      relationship: true,
      sharedCompany: true,
      body: true,
    },
    orderBy: { approvedAt: "desc" },
  });
}
