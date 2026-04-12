interface Props {
  skills: string[];
  accentColor: string;
}

export function SkillsSection({ skills, accentColor }: Props) {
  if (skills.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2
        className="text-lg font-semibold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="rounded-full border px-3 py-1 text-xs"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
