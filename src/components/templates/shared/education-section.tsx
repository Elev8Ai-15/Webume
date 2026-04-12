import type { Education } from "@/lib/types/profile";

interface Props {
  education: Education[];
  certifications: string[];
  accentColor: string;
}

export function EducationSection({
  education,
  certifications,
  accentColor,
}: Props) {
  if (education.length === 0 && certifications.length === 0) return null;

  return (
    <div className="space-y-4">
      {education.length > 0 && (
        <div className="space-y-3">
          <h2
            className="text-lg font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            Education
          </h2>
          {education.map((edu, i) => (
            <div key={i}>
              <p className="font-semibold">{edu.degree}</p>
              <p className="text-sm text-muted-foreground">
                {edu.school} {edu.year && `— ${edu.year}`}
              </p>
              {edu.details && (
                <p className="text-xs text-muted-foreground">{edu.details}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div className="space-y-2">
          <h2
            className="text-lg font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            Certifications
          </h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {certifications.map((cert, i) => (
              <li key={i}>{cert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
