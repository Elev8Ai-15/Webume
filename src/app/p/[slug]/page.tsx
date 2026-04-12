import { notFound } from "next/navigation";
import { after } from "next/server";
import type { Metadata } from "next";
import { getUserBySlug, incrementProfileViews } from "@/lib/repositories/user.repository";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import type { ProfileData, TemplateId } from "@/lib/types/profile";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const user = await getUserBySlug(slug);

  if (!user || !user.isPublic || !user.profileData) {
    return { title: "Profile Not Found" };
  }

  const profile = user.profileData as unknown as ProfileData;

  return {
    title: `${profile.basics.name} — ${profile.basics.title}`,
    description: profile.basics.tagline || profile.basics.summary,
    openGraph: {
      title: `${profile.basics.name} — ${profile.basics.title}`,
      description: profile.basics.tagline || profile.basics.summary,
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params;
  const user = await getUserBySlug(slug);

  if (!user || !user.isPublic || !user.profileData) {
    notFound();
  }

  // Increment views without blocking render
  after(() => incrementProfileViews(slug));

  const profileData = user.profileData as unknown as ProfileData;

  return (
    <div className="min-h-screen bg-background py-12">
      <TemplateRenderer
        profileData={profileData}
        templateId={user.selectedTemplate as TemplateId}
        profilePhoto={user.profilePhoto}
      />
    </div>
  );
}
