export const dynamic = "force-dynamic";
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
  getApprovedTestimonialsForUser,
  getMediaForUser,
  getMilestonesForUser,
} from "@/lib/repositories/career.repository";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { TestimonialsDisplay } from "@/components/portfolio/testimonials-display";
import { GalleryDisplay } from "@/components/portfolio/gallery-display";
import { MilestonesTimeline } from "@/components/portfolio/milestones-timeline";
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

  // PDR §5.2: two channels only. Testimonials, photos and owner-authored
  // milestones show when they exist; nothing on this page takes visitor input.
  const [testimonials, media, milestones] = await Promise.all([
    getApprovedTestimonialsForUser(user.id),
    getMediaForUser(user.id),
    getMilestonesForUser(user.id),
  ]);

  const accent = "var(--primary)";

  return (
    <div className="relative min-h-screen bg-background">
      <div className="lx-orbs" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 py-6 sm:px-10 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="font-heading text-2xl">
            Webume<span className="text-primary">.</span>
          </Link>
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
          profileHref={`/p/${user.slug}`}
        />

        {milestones.length > 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-card p-6 sm:p-8">
            <MilestonesTimeline
              milestones={milestones.map((m) => ({
                ...m,
                company: m.experience?.company ?? null,
              }))}
            />
          </div>
        )}

        {(testimonials.length > 0 || media.length > 0) && (
          <div className="mt-8 space-y-8 rounded-2xl border border-white/10 bg-card p-6 sm:p-8">
            {testimonials.length > 0 && (
              <TestimonialsDisplay testimonials={testimonials} />
            )}
            {media.length > 0 && (
              <GalleryDisplay media={media} accentColor={accent} />
            )}
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
