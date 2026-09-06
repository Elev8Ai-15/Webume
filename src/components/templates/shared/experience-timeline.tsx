import type { Experience } from "@/lib/types/profile";

interface Props {
  experiences: Experience[];
  accentColor: string;
}

export function ExperienceTimeline({ experiences, accentColor }: Props) {
  if (experiences.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: accentColor }}>
        Experience
      </h2>
      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <article
            key={i}
            className="relative overflow-hidden rounded-2xl border border-border bg-background/40 p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div>
                <h3 className="text-2xl leading-snug">{exp.role}</h3>
                <p className="text-base font-medium" style={{ color: accentColor }}>
                  {exp.company}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {exp.startDate} &ndash; {exp.endDate}
              </p>
            </div>

            {exp.description && (
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
                {exp.description}
              </p>
            )}

            {exp.metrics.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {exp.metrics.map((m, j) => (
                  <div
                    key={j}
                    className="rounded-lg border border-border bg-card px-3 py-3 text-center"
                  >
                    <p className="font-heading text-2xl" style={{ color: accentColor }}>
                      {m.value}
                    </p>
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
          </article>
        ))}
      </div>
    </section>
  );
}
