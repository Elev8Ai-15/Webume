import { MILESTONE_KINDS } from "@/lib/milestone-kinds";

export interface MilestoneItem {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  date: Date;
  company?: string | null;
}

export function MilestonesTimeline({
  milestones,
  heading = "Career milestones",
}: {
  milestones: MilestoneItem[];
  heading?: string;
}) {
  if (milestones.length === 0) return null;
  return (
    <section aria-label={heading}>
      <p className="portfolio-eyebrow">{heading}</p>
      <ol className="mt-5 space-y-5 border-l border-white/10 pl-5">
        {milestones.map((m) => (
          <li key={m.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[26px] top-2 h-2.5 w-2.5 rounded-full bg-primary"
            />
            <p className="text-xs uppercase tracking-[0.16em] text-primary">
              {MILESTONE_KINDS[m.kind as keyof typeof MILESTONE_KINDS] ?? m.kind}
              <span className="ml-2 normal-case tracking-normal text-muted-foreground">
                {m.date.toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                {m.company && ` · ${m.company}`}
              </span>
            </p>
            <p className="mt-1 font-heading text-lg">{m.title}</p>
            {m.description && (
              <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
