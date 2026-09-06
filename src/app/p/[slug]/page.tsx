import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import {
  incrementProfileViews,
  getUserByClerkId,
} from "@/lib/repositories/user.repository";
import { getProfileBySlug } from "@/lib/profile/profile.service";
import {
  getEndorsementsForUser,
  getMediaForUser,
} from "@/lib/repositories/social.repository";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { getTemplate } from "@/lib/templates/template-registry";
import { EndorsementsDisplay } from "@/components/social/endorsements-display";
import { GalleryDisplay } from "@/components/social/gallery-display";
import type { TemplateId } from "@/lib/types/profile";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProfileBySlug(slug);

  if (!result || !result.user.isPublic || !result.profileData) {
    return { title: "Profile Not Found" };
  }

  const profile = result.profileData;

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
  const result = await getProfileBySlug(slug);

  if (!result || !result.user.isPublic || !result.profileData) {
    notFound();
  }
  const { user, profileData } = result;

  // Determine if the viewer is the profile owner
  const { userId: viewerClerkId } = await auth();
  const viewer = viewerClerkId ? await getUserByClerkId(viewerClerkId) : null;
  const isOwner = viewer?.id === user.id;

  // Increment views in the background unless it's the owner
  if (!isOwner) {
    after(() => incrementProfileViews(slug));
  }

  // PDR §5.2: two channels only. Testimonials and photos show when they exist;
  // no visitor comment box or endorsement form on the public page.
  const [endorsements, media] = await Promise.all([
    getEndorsementsForUser(user.id),
    getMediaForUser(user.id),
  ]);

  const template = getTemplate(user.selectedTemplate as TemplateId);
  const accent = "var(--primary)";

  return (
    <div className="relative min-h-screen bg-background">
      <div className="lx-orbs" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-heading text-lg text-muted-foreground">Webume</span>
          {profileData.basics.email && (
            <a
              href={`mailto:${profileData.basics.email}`}
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Contact {profileData.basics.name.split(" ")[0]}
            </a>
          )}
        </div>

        <TemplateRenderer
          profileData={profileData}
          templateId={user.selectedTemplate as TemplateId}
          profilePhoto={user.profilePhoto}
        />

        {(endorsements.length > 0 || media.length > 0) && (
          <div className="mt-8 space-y-8 rounded-2xl border border-white/10 bg-card p-6 sm:p-8">
            {endorsements.length > 0 && (
              <EndorsementsDisplay endorsements={endorsements} accentColor={accent} />
            )}
            {media.length > 0 && <GalleryDisplay media={media} accentColor={accent} />}
          </div>
        )}

        <footer className="mt-14 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-primary hover:underline">
            Create your own Webume &mdash; free
          </Link>
          <p className="mt-1">The last resume you&apos;ll ever make.</p>
        </footer>
      </div>
    </div>
  );
}
