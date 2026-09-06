import type { Experience } from "@/lib/types/profile";

interface Props {
  experiences: Experience[];
  accentColor: string;
}

/** Each job is a chapter: numbered, titled, with its own numbers and story. */
export function ExperienceTimeline({ experiences, accentColor }: Props) {
  if (experiences.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: accentColor }}>
          Experience
        </h2>
        <p className="text-xs text-muted-foreground">
          {experiences.length} {experiences.length === 1 ? "position" : "positions"}
        </p>
      </div>

      <div className="space-y-5">
        {experiences.map((exp, i) => (
          <article
            key={i}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-card p-6 sm:p-8"
          >
            <div className="lx-spark-line absolute inset-x-0 top-0" aria-hidden="true" />
            <div className="grid gap-6 sm:grid-cols-[56px_1fr]">
              <p className="font-heading text-3xl leading-none text-primary/70">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div>
                    <h3 className="text-2xl leading-snug sm:text-3xl">{exp.role}</h3>
                    <p className="mt-1 text-base font-medium" style={{ color: accentColor }}>
                      {exp.company}
                      {exp.companyInfo?.location ? (
                        <span className="text-muted-foreground"> &middot; {exp.companyInfo.location}</span>
                      ) : null}
                    </p>
                  </div>
                  <p className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                    {exp.startDate} &ndash; {exp.endDate}
                  </p>
                </div>

                {exp.description && (
                  <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">{exp.description}</p>
                )}

                {exp.metrics.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {exp.metrics.map((m, j) => (
                      <div key={j} className="rounded-xl border border-white/10 bg-background/50 px-3 py-3 text-center">
                        <p className="font-heading text-2xl" style={{ color: accentColor }}>{m.value}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {exp.responsibilities.length > 0 && (
                  <ul className="mt-5 space-y-2 text-[15px] leading-relaxed text-foreground/85">
                    {exp.responsibilities.map((r, j) => (
                      <li key={j} className="flex gap-3">
                        <span
                          className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: accentColor }}
                          aria-hidden="true"
                        />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
