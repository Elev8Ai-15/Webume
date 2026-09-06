import type { ProfileData, TemplateId } from "@/lib/types/profile";
import { ProfileHero } from "./shared/profile-hero";
import { ExperienceTimeline } from "./shared/experience-timeline";
import { SkillsSection } from "./shared/skills-section";
import { EducationSection } from "./shared/education-section";

interface Props {
  profileData: ProfileData;
  templateId: TemplateId;
  profilePhoto?: string | null;
  profileHref?: string;
}

/** Executive portfolio layout. One system for every profile (Vision Plan v2);
 *  template color skins are ignored, the signature color comes from the tokens. */
export function TemplateRenderer({
  profileData,
  templateId,
  profilePhoto,
  profileHref,
}: Props) {
  const accent = "var(--primary)";
  // "By the numbers": one headline metric per job (up to 3), only when there is
  // more than one job so the band doesn't just repeat the first chapter's tiles.
  const perJob = profileData.experience
    .filter((e) => e.metrics.length > 0)
    .map((e) => ({ ...e.metrics[0], company: e.company }));
  const headline = perJob.length >= 2 ? perJob.slice(0, 3) : [];
  const positions = profileData.experience.length;
  const hasEducation =
    profileData.education.length > 0 || profileData.certifications.length > 0;

  return (
    <article className="mx-auto w-full max-w-6xl" data-template={templateId}>
      {/* Hero */}
      <header className="relative overflow-hidden portfolio-cover rounded-3xl border border-white/10 bg-card px-6 py-10 sm:px-12 sm:py-16">
        <div className="lx-atmo" aria-hidden="true" />
        <div
          className="lx-spark-line absolute inset-x-0 top-0"
          aria-hidden="true"
        />
        <div className="relative">
          <ProfileHero
            basics={profileData.basics}
            profilePhoto={profilePhoto}
            accentColor={accent}
          />
        </div>
      </header>

      <nav aria-label="Portfolio sections" className="portfolio-navigation">
        <span className="mr-auto hidden text-xs uppercase tracking-[.16em] text-muted-foreground sm:block">
          Career portfolio
        </span>
        {positions > 0 && <a href="#career">Experience</a>}
        {profileData.skills.length > 0 && <a href="#expertise">Expertise</a>}
        {hasEducation && <a href="#education">Education</a>}
        {profileData.achievements.length > 0 && (
          <a href="#achievements">Achievements</a>
        )}
      </nav>
      {/* By the numbers */}
      {headline.length > 0 && (
        <section
          className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="By the numbers"
        >
          {headline.map((m, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-card/60 px-6 py-6"
            >
              <p className="font-heading text-4xl leading-none text-primary">
                {m.value}
              </p>
              <p className="mt-2 text-xs tracking-wide text-muted-foreground uppercase">
                {m.label}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">{m.company}</p>
            </div>
          ))}
        </section>
      )}

      {/* Experience chapters */}
      <div className="mt-12">
        <ExperienceTimeline
          experiences={profileData.experience}
          profileHref={profileHref}
          accentColor={accent}
        />
      </div>

      {/* Skills + Education */}
      {(profileData.skills.length > 0 || hasEducation) && (
        <div
          className={`mt-12 grid gap-8 ${profileData.skills.length > 0 && hasEducation ? "md:grid-cols-[1.2fr_1fr]" : ""}`}
        >
          {profileData.skills.length > 0 && (
            <div
              id="expertise"
              className="scroll-mt-8 rounded-2xl border border-white/10 bg-card p-6 sm:p-8"
            >
              <SkillsSection skills={profileData.skills} accentColor={accent} />
            </div>
          )}
          {hasEducation && (
            <div
              id="education"
              className="scroll-mt-8 rounded-2xl border border-white/10 bg-card p-6 sm:p-8"
            >
              <EducationSection
                education={profileData.education}
                certifications={profileData.certifications}
                accentColor={accent}
              />
            </div>
          )}
        </div>
      )}

      {/* Achievements */}
      {profileData.achievements.length > 0 && (
        <section
          id="achievements"
          className="scroll-mt-8 mt-8 rounded-2xl border border-white/10 bg-card p-6 sm:p-8"
        >
          <h2
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: accent }}
          >
            Achievements
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {profileData.achievements.map((a, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-background/40 p-4"
              >
                <p className="font-heading text-lg">{a.title}</p>
                {a.description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {a.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="sr-only">{positions} positions listed.</p>
    </article>
  );
}
