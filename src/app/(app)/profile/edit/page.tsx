import { db } from "@/lib/db";
import { EvidenceForm } from "./evidence-form";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getProfileByClerkId } from "@/lib/profile/profile.service";
import { QualificationsForm } from "./qualifications-form";
import { HeaderForm } from "./header-form";
import { ExperienceEditor, type ExperienceRow } from "./experience-editor";

export default async function ProfileEditPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const result = await getProfileByClerkId(userId);
  if (!result) redirect("/sign-in");
  const { user, profileData } = result;
  const documents = await db.document.findMany({
    where: { userId: user.id },
    select: { id: true, title: true, experienceId: true },
    orderBy: { createdAt: "desc" },
  });

  const basics = profileData?.basics ?? {
    name: user.name,
    title: "",
    tagline: "",
    summary: "",
    location: "",
    phone: "",
    email: "",
    linkedin: "",
    website: "",
  };

  const experiences: ExperienceRow[] = user.experiences.map((exp) => ({
    id: exp.id,
    company: exp.company,
    role: exp.role,
    startDate: exp.startDate,
    endDate: exp.endDate,
    description: exp.description,
    responsibilities: exp.responsibilities,
    metrics: exp.metrics.map((m) => ({ value: m.value, label: m.label })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit profile</h1>
        <p className="text-muted-foreground">
          Fill in your details by hand, or fix anything the resume import got
          wrong.{" "}
          <Link href="/profile" className="text-primary hover:underline">
            Back to preview
          </Link>
        </p>
      </div>
      <Separator />

      <HeaderForm
        initialBasics={basics}
        initialSkills={profileData?.skills ?? []}
      />

      <ExperienceEditor experiences={experiences} />
      <EvidenceForm experiences={experiences} documents={documents} />
      <QualificationsForm
        initial={{
          education: profileData?.education ?? [],
          certifications: profileData?.certifications ?? [],
          achievements: profileData?.achievements ?? [],
        }}
      />
    </div>
  );
}
