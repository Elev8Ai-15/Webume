import { db } from "@/lib/db";
/** Every evidence lookup is scoped to both the job and its owner. */
export async function getCareerEvidence(userId: string, experienceId: string) {
  const [documents, testimonials, media, milestones] = await Promise.all([
    db.document.findMany({
      where: { userId, experienceId },
      select: { id: true, title: true, url: true, kind: true, year: true },
      orderBy: { createdAt: "desc" },
    }),
    db.testimonial.findMany({
      where: { recipientId: userId, experienceId, status: "approved" },
      select: {
        id: true,
        issuerName: true,
        relationship: true,
        sharedCompany: true,
        body: true,
      },
      orderBy: { approvedAt: "desc" },
    }),
    db.mediaAsset.findMany({
      where: { userId, experienceId },
      orderBy: { createdAt: "desc" },
    }),
    db.careerActivity.findMany({
      where: { userId, experienceId },
      orderBy: { date: "desc" },
    }),
  ]);
  return { documents, testimonials, media, milestones };
}
