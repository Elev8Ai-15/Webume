import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface MediaAsset {
  id: string;
  url: string;
  kind: string;
  caption: string | null;
  year: string | null;
}

interface Props {
  media: MediaAsset[];
  accentColor: string;
}

export function GalleryDisplay({ media, accentColor }: Props) {
  if (media.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2
        className="text-lg font-semibold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Gallery
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {media.map((m) => (
          <div
            key={m.id}
            className="group relative overflow-hidden rounded-lg border"
          >
            <div className="relative aspect-square">
              <Image
                src={m.url}
                alt={m.caption ?? "Career moment"}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <Badge
                variant="outline"
                className="text-xs capitalize text-white"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                {m.kind}
                {m.year && ` · ${m.year}`}
              </Badge>
              {m.caption && (
                <p className="mt-1 line-clamp-2 text-xs text-white">
                  {m.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
