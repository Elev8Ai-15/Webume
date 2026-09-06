import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getProfileByClerkId } from "@/lib/profile/profile.service";
import { getCareerEvidence } from "@/lib/profile/career.service";
import { CareerChapter } from "@/components/templates/career-chapter";
export default async function PrivateCareerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const { id } = await params;
  const result = await getProfileByClerkId(userId);
  if (!result?.profileData) notFound();
  const experience = result.profileData.experience.find((e) => e.id === id);
  if (!experience) notFound();
  const evidence = await getCareerEvidence(result.user.id, id);
  return (
    <CareerChapter
      name={result.profileData.basics.name}
      experience={experience}
      backHref="/profile"
      evidence={evidence}
    />
  );
}
