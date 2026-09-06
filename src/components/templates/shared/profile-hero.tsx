import Image from "next/image";
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
    {
      label: basics.linkedin,
      url: basics.linkedin && href("url", basics.linkedin),
    },
    {
      label: basics.website,
      url: basics.website && href("url", basics.website),
    },
  ].filter((l) => l.label);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_240px] lg:items-start">
      {profilePhoto ? (
        <div className="portrait-frame h-44 w-36 shrink-0 overflow-hidden rounded-2xl border border-white/15 lg:order-2 lg:h-72 lg:w-60">
          <Image
            src={profilePhoto}
            alt={basics.name}
            width={480}
            height={576}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div
          className="portrait-frame flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-background/60 font-heading text-6xl lg:order-2 lg:h-60 lg:w-60 lg:text-8xl"
          style={{ color: accentColor }}
          aria-hidden="true"
        >
          {basics.name
            ?.trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((n) => n[0])
            .join("") || "W"}
        </div>
      )}

      <div className="min-w-0">
        <p
          className="text-xs font-semibold tracking-[0.24em] uppercase"
          style={{ color: accentColor }}
        >
          Professional portfolio
        </p>
        <h1 className="mt-3 text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[1.02] text-balance">
          {basics.name}
        </h1>
        {basics.title && (
          <p className="mt-3 text-xl font-medium text-foreground/90 sm:text-2xl">
            {basics.title}
          </p>
        )}
        {basics.tagline && basics.tagline.trim() !== basics.summary?.trim() && (
          <p className="mt-2 text-base text-muted-foreground">
            {basics.tagline}
          </p>
        )}

        {basics.summary && (
          <p className="mt-6 max-w-prose text-base leading-relaxed text-foreground/85">
            {basics.summary}
          </p>
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
                  className="max-w-full break-all rounded-full border border-white/15 bg-background/50 px-3.5 py-2.5 text-sm text-foreground/90 transition-colors hover:border-primary/60 hover:text-primary"
                >
                  {l.label}
                </a>
              ) : (
                <span
                  key={l.label}
                  className="max-w-full break-all rounded-full border border-white/15 bg-background/50 px-3.5 py-2.5 text-sm text-muted-foreground"
                >
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
