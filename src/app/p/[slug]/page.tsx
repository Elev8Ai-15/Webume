import { notFound } from "next/navigation";
import { after } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import {
  getUserBySlug,
  incrementProfileViews,
  getUserByClerkId,
} from "@/lib/repositories/user.repository";
import {
  getEndorsementsForUser,
  getCommentsForUser,
  getMediaForUser,
  getActivityForUser,
} from "@/lib/repositories/social.repository";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { getTemplate } from "@/lib/templates/template-registry";
import { EndorsementsDisplay } from "@/components/social/endorsements-display";
import { CommentsDisplay } from "@/components/social/comments-display";
import { GalleryDisplay } from "@/components/social/gallery-display";
import { ActivityFeed } from "@/components/social/activity-feed";
import { SocialActionsPanel } from "@/components/social/social-actions-panel";
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

  // Determine if the viewer is the profile owner
  const { userId: viewerClerkId } = await auth();
  const viewer = viewerClerkId ? await getUserByClerkId(viewerClerkId) : null;
  const isOwner = viewer?.id === user.id;

  // Increment views in the background unless it's the owner
  if (!isOwner) {
    after(() => incrementProfileViews(slug));
  }

  // Load social data in parallel
  const [endorsements, comments, media, activities] = await Promise.all([
    getEndorsementsForUser(user.id),
    getCommentsForUser(user.id),
    getMediaForUser(user.id),
    getActivityForUser(user.id),
  ]);

  const profileData = user.profileData as unknown as ProfileData;
  const template = getTemplate(user.selectedTemplate as TemplateId);
  const accent = template.color;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-3xl space-y-8 px-4">
        <TemplateRenderer
          profileData={profileData}
          templateId={user.selectedTemplate as TemplateId}
          profilePhoto={user.profilePhoto}
        />

        <div className="space-y-8 rounded-xl border bg-card p-8">
          <SocialActionsPanel
            recipientSlug={slug}
            isOwner={isOwner}
            suggestedSkills={profileData.skills}
          />

          <EndorsementsDisplay
            endorsements={endorsements}
            accentColor={accent}
          />

          <ActivityFeed activities={activities} accentColor={accent} />

          <GalleryDisplay media={media} accentColor={accent} />

          <CommentsDisplay comments={comments} accentColor={accent} />
        </div>
      </div>
    </div>
  );
}
