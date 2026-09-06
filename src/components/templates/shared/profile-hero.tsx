import type { ProfileBasics } from "@/lib/types/profile";

interface Props {
  basics: ProfileBasics;
  profilePhoto?: string | null;
  accentColor: string;
}

function href(kind: "email" | "phone" | "url", v: string) {
  if (kind === "email") return `mailto:${v}`;
  if (kind === "phone") return `tel:${v.replace(/[^\d+]/g, "")}`;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export function ProfileHero({ basics, profilePhoto, accentColor }: Props) {
  const links: { label: string; url?: string }[] = [
    { label: basics.location },
    { label: basics.email, url: basics.email && href("email", basics.email) },
    { label: basics.phone, url: basics.phone && href("phone", basics.phone) },
    { label: basics.linkedin, url: basics.linkedin && href("url", basics.linkedin) },
    { label: basics.website, url: basics.website && href("url", basics.website) },
  ].filter((l) => l.label);

  return (
    <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-center">
      {profilePhoto ? (
        <div className="h-40 w-40 shrink-0 overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] sm:h-48 sm:w-48">
          <img src={profilePhoto} alt={basics.name} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div
          className="flex h-40 w-40 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-background/60 font-heading text-6xl sm:h-48 sm:w-48"
          style={{ color: accentColor }}
          aria-hidden="true"
        >
          {basics.name?.trim().charAt(0) || "W"}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase" style={{ color: accentColor }}>
          Professional portfolio
        </p>
        <h1 className="mt-3 text-[clamp(36px,6vw,64px)] leading-[1.02] text-balance">{basics.name}</h1>
        {basics.title && <p className="mt-3 text-xl font-medium text-foreground/90 sm:text-2xl">{basics.title}</p>}
        {basics.tagline && <p className="mt-2 text-base text-muted-foreground">{basics.tagline}</p>}

        {basics.summary && (
          <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-foreground/85">{basics.summary}</p>
        )}

        {links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {links.map((l) =>
              l.url ? (
                <a
                  key={l.label}
                  href={l.url}
                  target={l.url.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="rounded-full border border-white/15 bg-background/50 px-3.5 py-1.5 text-xs text-foreground/90 transition-colors hover:border-primary/60 hover:text-primary"
                >
                  {l.label}
                </a>
              ) : (
                <span key={l.label} className="rounded-full border border-white/15 bg-background/50 px-3.5 py-1.5 text-xs text-muted-foreground">
                  {l.label}
                </span>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
