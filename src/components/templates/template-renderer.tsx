import type { ProfileData, TemplateId } from "@/lib/types/profile";
import { ProfileHero } from "./shared/profile-hero";
import { ExperienceTimeline } from "./shared/experience-timeline";
import { SkillsSection } from "./shared/skills-section";
import { EducationSection } from "./shared/education-section";

interface Props {
  profileData: ProfileData;
  templateId: TemplateId;
  profilePhoto?: string | null;
}

/** Executive portfolio layout. One system for every profile (Vision Plan v2);
 *  template color skins are ignored, the signature color comes from the tokens. */
export function TemplateRenderer({ profileData, templateId, profilePhoto }: Props) {
  const accent = "var(--primary)";
  // "By the numbers": one headline metric per job (up to 3), only when there is
  // more than one job so the band doesn't just repeat the first chapter's tiles.
  const perJob = profileData.experience.map((e) => e.metrics[0]).filter(Boolean);
  const headline = perJob.length >= 2 ? perJob.slice(0, 3) : [];
  const years = profileData.experience.length;

  return (
    <article className="mx-auto w-full max-w-4xl" data-template={templateId}>
      {/* Hero */}
      <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-card px-6 py-10 sm:px-12 sm:py-14">
        <div className="lx-atmo" aria-hidden="true" />
        <div className="lx-spark-line absolute inset-x-0 top-0" aria-hidden="true" />
        <div className="relative">
          <ProfileHero basics={profileData.basics} profilePhoto={profilePhoto} accentColor={accent} />
        </div>
      </header>

      {/* By the numbers */}
      {headline.length > 0 && (
        <section className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="By the numbers">
          {headline.map((m, i) => (
            <div key={i} className="lx-gradient-border rounded-2xl px-5 py-5 text-center">
              <p className="font-heading text-4xl leading-none text-primary">{m.value}</p>
              <p className="mt-2 text-xs tracking-wide text-muted-foreground uppercase">{m.label}</p>
            </div>
          ))}
        </section>
      )}

      {/* Experience chapters */}
      <div className="mt-12">
        <ExperienceTimeline experiences={profileData.experience} accentColor={accent} />
      </div>

      {/* Skills + Education */}
      <div className="mt-12 grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-card p-6 sm:p-8">
          <SkillsSection skills={profileData.skills} accentColor={accent} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-card p-6 sm:p-8">
          <EducationSection
            education={profileData.education}
            certifications={profileData.certifications}
            accentColor={accent}
          />
        </div>
      </div>

      {/* Achievements */}
      {profileData.achievements.length > 0 && (
        <section className="mt-8 rounded-2xl border border-white/10 bg-card p-6 sm:p-8">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: accent }}>
            Achievements
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {profileData.achievements.map((a, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-background/40 p-4">
                <p className="font-heading text-lg">{a.title}</p>
                {a.description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="sr-only">{years} positions listed.</p>
    </article>
  );
}
