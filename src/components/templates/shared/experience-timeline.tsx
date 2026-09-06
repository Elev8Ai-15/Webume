import Link from "next/link";
import { ArrowDownRight, ChevronDown } from "lucide-react";
import type { Experience } from "@/lib/types/profile";

interface Props {
  experiences: Experience[];
  accentColor: string;
  profileHref?: string;
}

/** Scannable chapters with progressive detail. All content comes from the owner. */
export function ExperienceTimeline({
  experiences,
  accentColor,
  profileHref,
}: Props) {
  if (!experiences.length) return null;
  return (
    <section id="career" className="scroll-mt-8" aria-labelledby="career-title">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="portfolio-eyebrow">01 / Career</p>
          <h2 id="career-title" className="mt-3 text-3xl sm:text-4xl">
            The work behind the title.
          </h2>
        </div>
        <span className="shrink-0 text-sm text-muted-foreground">
          {experiences.length}{" "}
          {experiences.length === 1 ? "chapter" : "chapters"}
        </span>
      </div>
      <div className="career-chapters">
        {experiences.map((exp, i) => {
          const hasDetail =
            exp.responsibilities.length > 0 ||
            exp.dayInLife.length > 0 ||
            !!exp.companyInfo.description;
          return (
            <article
              key={i}
              id={`chapter-${i + 1}`}
              className="career-chapter scroll-mt-8"
            >
              <div className="chapter-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p
                    className="text-sm font-medium"
                    style={{ color: accentColor }}
                  >
                    {exp.company}
                  </p>
                  {(exp.startDate || exp.endDate) && (
                    <p className="text-xs tracking-wide text-muted-foreground">
                      {[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}
                    </p>
                  )}
                </div>
                <h3 className="mt-3 text-2xl leading-tight sm:text-3xl">
                  {exp.role}
                </h3>
                {exp.companyInfo.location && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {exp.companyInfo.location}
                  </p>
                )}
                {exp.description && (
                  <p className="mt-5 max-w-prose whitespace-pre-line text-base leading-relaxed text-foreground/80">
                    {exp.description}
                  </p>
                )}
                {exp.metrics.length > 0 && (
                  <dl className="mt-7 grid grid-cols-2 gap-5 border-y border-white/10 py-5 sm:grid-cols-3">
                    {exp.metrics.map((m, j) => (
                      <div key={j} className="min-w-0">
                        <dd className="break-words font-heading text-2xl text-foreground sm:text-3xl">
                          {m.value}
                        </dd>
                        <dt className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {m.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                )}
                {profileHref && exp.id && (
                  <Link
                    href={`${profileHref}/career/${exp.id}`}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    Open career chapter <span aria-hidden="true">↗</span>
                  </Link>
                )}
                {hasDetail && (
                  <details className="chapter-details mt-5" open={i === 0}>
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-primary">
                      <span className="flex items-center gap-2">
                        <ArrowDownRight
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                        Explore this chapter
                        <span className="sr-only">: {exp.company}</span>
                      </span>
                      <ChevronDown
                        className="chapter-chevron h-4 w-4"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="space-y-6 pb-2 pt-4">
                      {exp.responsibilities.length > 0 && (
                        <div>
                          <h4 className="mb-4 text-xs font-medium uppercase tracking-[.15em] text-muted-foreground">
                            Scope & contributions
                          </h4>
                          <ul className="space-y-3">
                            {exp.responsibilities.map((r, j) => (
                              <li
                                key={j}
                                className="flex gap-3 text-base leading-relaxed text-foreground/80"
                              >
                                <span
                                  className="mt-3 h-1 w-1 shrink-0 rounded-full bg-primary"
                                  aria-hidden="true"
                                />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {exp.companyInfo.description && (
                        <div className="rounded-xl bg-background/40 p-5">
                          <h4 className="mb-2 text-sm font-medium">
                            About {exp.company}
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {exp.companyInfo.description}
                          </p>
                        </div>
                      )}
                      {exp.dayInLife.length > 0 && (
                        <div>
                          <h4 className="mb-3 text-sm font-medium">
                            A day in the role
                          </h4>
                          <dl className="space-y-3">
                            {exp.dayInLife.map((entry, j) => (
                              <div
                                key={j}
                                className="grid grid-cols-[5rem_1fr] gap-4 text-sm"
                              >
                                <dt className="text-primary">{entry.time}</dt>
                                <dd className="text-muted-foreground">
                                  {entry.activity}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
