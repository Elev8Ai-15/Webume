interface Activity {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  date: Date;
  experienceCompany: string | null;
}

interface Props {
  activities: Activity[];
  accentColor: string;
}

const KIND_LABELS: Record<string, string> = {
  promotion: "Promoted",
  review: "Performance Review",
  award: "Award",
  project: "Project",
  certification: "Certified",
  custom: "Milestone",
};

export function ActivityFeed({ activities, accentColor }: Props) {
  if (activities.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2
        className="text-lg font-semibold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Career Timeline
      </h2>
      <div className="space-y-4">
        {activities.map((a) => (
          <div
            key={a.id}
            className="relative border-l-2 pl-4"
            style={{ borderColor: accentColor }}
          >
            <div
              className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="font-medium uppercase tracking-wide"
                  style={{ color: accentColor }}
                >
                  {KIND_LABELS[a.kind] ?? a.kind}
                </span>
                <span>·</span>
                <span>
                  {new Date(a.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {a.experienceCompany && (
                  <>
                    <span>·</span>
                    <span>{a.experienceCompany}</span>
                  </>
                )}
              </div>
              <p className="font-medium">{a.title}</p>
              {a.description && (
                <p className="text-sm text-muted-foreground">{a.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
