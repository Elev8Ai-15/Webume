import type { Experience } from "@/lib/types/profile";

interface Props {
  experiences: Experience[];
  accentColor: string;
}

export function ExperienceTimeline({ experiences, accentColor }: Props) {
  if (experiences.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2
        className="text-lg font-semibold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Experience
      </h2>
      <div className="space-y-8">
        {experiences.map((exp, i) => (
          <div key={i} className="relative border-l-2 pl-6" style={{ borderColor: accentColor }}>
            <div
              className="absolute -left-[7px] top-1 h-3 w-3 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold">{exp.role}</h3>
                <p className="text-sm" style={{ color: accentColor }}>
                  {exp.company}
                </p>
                <p className="text-xs text-muted-foreground">
                  {exp.startDate} — {exp.endDate}
                </p>
              </div>
              {exp.description && (
                <p className="text-sm text-muted-foreground">
                  {exp.description}
                </p>
              )}
              {exp.responsibilities.length > 0 && (
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {exp.responsibilities.map((r, j) => (
                    <li key={j}>{r}</li>
                  ))}
                </ul>
              )}
              {exp.metrics.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {exp.metrics.map((m, j) => (
                    <div
                      key={j}
                      className="rounded-md border px-3 py-1 text-center"
                    >
                      <p className="text-sm font-semibold" style={{ color: accentColor }}>
                        {m.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
