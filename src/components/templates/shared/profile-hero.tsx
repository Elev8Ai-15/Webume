import type { ProfileBasics } from "@/lib/types/profile";

interface Props {
  basics: ProfileBasics;
  profilePhoto?: string | null;
  accentColor: string;
}

export function ProfileHero({ basics, profilePhoto, accentColor }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-6">
        {profilePhoto && (
          <div
            className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2"
            style={{ borderColor: accentColor }}
          >
            <img
              src={profilePhoto}
              alt={basics.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{basics.name}</h1>
          <p className="text-xl" style={{ color: accentColor }}>
            {basics.title}
          </p>
          {basics.tagline && (
            <p className="text-sm text-muted-foreground">{basics.tagline}</p>
          )}
        </div>
      </div>

      {/* Contact chips */}
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {basics.email && <span>{basics.email}</span>}
        {basics.phone && <span>{basics.phone}</span>}
        {basics.location && <span>{basics.location}</span>}
        {basics.linkedin && <span>{basics.linkedin}</span>}
        {basics.website && <span>{basics.website}</span>}
      </div>

      {basics.summary && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {basics.summary}
        </p>
      )}
    </div>
  );
}
