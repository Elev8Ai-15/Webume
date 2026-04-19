import { Badge } from "@/components/ui/badge";

interface Endorsement {
  id: string;
  skill: string;
  message: string | null;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Props {
  endorsements: Endorsement[];
  accentColor: string;
}

export function EndorsementsDisplay({ endorsements, accentColor }: Props) {
  if (endorsements.length === 0) return null;

  // Group by skill
  const bySkill = endorsements.reduce<Record<string, Endorsement[]>>(
    (acc, e) => {
      (acc[e.skill] ??= []).push(e);
      return acc;
    },
    {},
  );

  const sortedSkills = Object.entries(bySkill).sort(
    ([, a], [, b]) => b.length - a.length,
  );

  return (
    <div className="space-y-3">
      <h2
        className="text-lg font-semibold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Endorsements ({endorsements.length})
      </h2>
      <div className="flex flex-wrap gap-2">
        {sortedSkills.map(([skill, list]) => (
          <div
            key={skill}
            className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
            style={{ borderColor: accentColor }}
          >
            <span style={{ color: accentColor }}>{skill}</span>
            <Badge
              variant="outline"
              className="h-5 border-0 px-1.5 text-xs"
              style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
            >
              {list.length}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
