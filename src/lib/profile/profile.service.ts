import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type {
  CompanyInfo,
  DayInLifeEntry,
  Experience as ExperienceData,
  ProfileData,
} from "@/lib/types/profile";

const EMPTY_COMPANY_INFO: CompanyInfo = {
  website: "",
  domain: "",
  industry: "",
  location: "",
  size: "",
  description: "",
};

// Header data that stays on User.profileData after the relational split.
type ProfileHeader = Omit<ProfileData, "experience">;

export type UserWithExperiences = Prisma.UserGetPayload<{
  include: { experiences: { include: { metrics: true } } };
}>;

export const experiencesInclude = {
  experiences: {
    orderBy: { displayOrder: "asc" as const },
    include: { metrics: true },
  },
};

/**
 * Rebuild the ProfileData shape (consumed by renderer/tailor/ATS) from
 * relational Experience rows + the header JSON on User.profileData.
 * Returns null when the user has no profile yet.
 */
export function assembleProfileData(
  user: UserWithExperiences,
): ProfileData | null {
  const header = user.profileData as unknown as ProfileHeader | null;
  if (!header?.basics) return null;

  const experience: ExperienceData[] = user.experiences.map((exp) => ({
    company: exp.company,
    companyInfo:
      (exp.companyInfo as unknown as CompanyInfo | null) ?? EMPTY_COMPANY_INFO,
    role: exp.role,
    startDate: exp.startDate,
    endDate: exp.endDate,
    description: exp.description,
    responsibilities: exp.responsibilities,
    dayInLife: (exp.dayInLife as unknown as DayInLifeEntry[] | null) ?? [],
    metrics: exp.metrics.map((m) => ({ value: m.value, label: m.label })),
  }));

  return {
    basics: header.basics,
    experience,
    skills: header.skills ?? [],
    achievements: header.achievements ?? [],
    education: header.education ?? [],
    certifications: header.certifications ?? [],
  };
}

/**
 * Persist an AI-parsed profile: header JSON on the user row, experiences as
 * relational rows. Replaces all existing experiences (a re-upload is a
 * re-import; manual edits happen against rows afterward).
 */
export async function saveParsedProfile(
  internalUserId: string,
  data: ProfileData,
  extra?: { rawText?: string; resumeUrl?: string },
): Promise<void> {
  const { experience, ...header } = data;

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: internalUserId },
      data: {
        profileData: JSON.parse(JSON.stringify(header)),
        ...(extra?.rawText !== undefined && { rawText: extra.rawText }),
        ...(extra?.resumeUrl !== undefined && { resumeUrl: extra.resumeUrl }),
      },
    });

    await tx.experience.deleteMany({ where: { userId: internalUserId } });

    for (const [index, exp] of experience.entries()) {
      await tx.experience.create({
        data: {
          userId: internalUserId,
          company: exp.company,
          role: exp.role,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          responsibilities: exp.responsibilities,
          companyInfo: JSON.parse(JSON.stringify(exp.companyInfo)),
          dayInLife: JSON.parse(JSON.stringify(exp.dayInLife ?? [])),
          displayOrder: index,
          metrics: {
            create: (exp.metrics ?? []).map((m) => ({
              value: m.value,
              label: m.label,
            })),
          },
        },
      });
    }
  });
}

export async function getProfileByClerkId(clerkId: string) {
  const user = await db.user.findUnique({
    where: { clerkId },
    include: { ...experiencesInclude, subscription: true },
  });
  if (!user) return null;
  return { user, profileData: assembleProfileData(user) };
}

export async function getProfileBySlug(slug: string) {
  const user = await db.user.findUnique({
    where: { slug },
    include: experiencesInclude,
  });
  if (!user) return null;
  return { user, profileData: assembleProfileData(user) };
}
