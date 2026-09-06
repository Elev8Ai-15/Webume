interface Props {
  skills: string[];
  accentColor: string;
}

export function SkillsSection({ skills, accentColor }: Props) {
  if (skills.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2
        className="text-xs font-semibold tracking-[0.2em] uppercase"
        style={{ color: accentColor }}
      >
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm text-foreground/90"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
