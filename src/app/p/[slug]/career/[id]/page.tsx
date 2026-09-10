export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getProfileBySlug } from "@/lib/profile/profile.service";
import { getCareerEvidence } from "@/lib/profile/career.service";
import { CareerChapter } from "@/components/templates/career-chapter";
export const metadata = { title: "Career chapter | Careerory" };
export default async function PublicCareerPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const result = await getProfileBySlug(slug);
  if (!result?.user.isPublic || !result.profileData) notFound();
  const experience = result.profileData.experience.find((e) => e.id === id);
  if (!experience) notFound();
  const evidence = await getCareerEvidence(result.user.id, id);
  return (
    <CareerChapter
      name={result.profileData.basics.name}
      experience={experience}
      backHref={`/p/${slug}`}
      evidence={evidence}
    />
  );
}
