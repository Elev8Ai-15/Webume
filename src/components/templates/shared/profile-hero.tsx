import type { ProfileBasics } from "@/lib/types/profile";

interface Props {
  basics: ProfileBasics;
  profilePhoto?: string | null;
  accentColor: string;
}

export function ProfileHero({ basics, profilePhoto, accentColor }: Props) {
  const contacts = [
    basics.location,
    basics.email,
    basics.phone,
    basics.linkedin,
    basics.website,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {profilePhoto ? (
          <div
            className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 shadow-lg"
            style={{ borderColor: accentColor }}
          >
            <img
              src={profilePhoto}
              alt={basics.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border bg-secondary font-heading text-4xl"
            style={{ color: accentColor }}
            aria-hidden="true"
          >
            {basics.name?.trim().charAt(0) || "W"}
          </div>
        )}
        <div className="min-w-0 space-y-2">
          <h1 className="text-4xl leading-tight sm:text-5xl">{basics.name}</h1>
          <p className="text-xl font-medium" style={{ color: accentColor }}>
            {basics.title}
          </p>
          {basics.tagline && (
            <p className="text-base text-muted-foreground">{basics.tagline}</p>
          )}
        </div>
      </div>

      {contacts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {contacts.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {basics.summary && (
        <p className="max-w-prose text-[15px] leading-relaxed text-foreground/85">
          {basics.summary}
        </p>
      )}
    </div>
  );
}
