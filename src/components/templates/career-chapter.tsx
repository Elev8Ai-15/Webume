import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import type { Experience } from "@/lib/types/profile";
import { ExperienceTimeline } from "./shared/experience-timeline";
import { TestimonialsDisplay } from "@/components/portfolio/testimonials-display";
import { GalleryDisplay } from "@/components/portfolio/gallery-display";
import { MilestonesTimeline } from "@/components/portfolio/milestones-timeline";
import type { getCareerEvidence } from "@/lib/profile/career.service";
export function CareerChapter({
  name,
  experience,
  backHref,
  evidence,
}: {
  name: string;
  experience: Experience;
  backHref: string;
  evidence: Awaited<ReturnType<typeof getCareerEvidence>>;
}) {
  return (
    <article className="mx-auto max-w-5xl space-y-10 px-5 py-10 sm:px-10">
      <Link
        href={backHref}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to {name}’s portfolio
      </Link>
      <header className="portfolio-cover rounded-3xl border border-white/10 p-7 sm:p-12">
        <p className="portfolio-eyebrow">{name} / Career chapter</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">{experience.company}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{experience.role}</p>
      </header>
      <ExperienceTimeline
        experiences={[experience]}
        accentColor="var(--primary)"
      />
      <MilestonesTimeline
        milestones={evidence.milestones}
        heading="Milestones in this chapter"
      />
      {evidence.documents.length > 0 && (
        <section>
          <p className="portfolio-eyebrow">Supporting work</p>
          <h2 className="mt-3 text-3xl">Evidence & recognition</h2>
          <div className="mt-6 divide-y divide-white/10">
            {evidence.documents.map((d) => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center justify-between gap-4 py-5"
              >
                <div>
                  <p className="text-base font-medium">{d.title}</p>
                  <p className="mt-1 text-sm capitalize text-muted-foreground">
                    {d.kind}
                    {d.year && ` · ${d.year}`}
                  </p>
                </div>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-primary"
                  aria-label="Opens external document"
                />
              </a>
            ))}
          </div>
        </section>
      )}
      <GalleryDisplay media={evidence.media} accentColor="var(--primary)" />
      <TestimonialsDisplay testimonials={evidence.testimonials} />
    </article>
  );
}
