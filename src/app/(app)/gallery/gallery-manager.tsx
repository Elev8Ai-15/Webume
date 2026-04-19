"use client";

import Image from "next/image";
import { useActionState, useTransition } from "react";
import {
  uploadMediaAsset,
  deleteMediaAsset,
} from "@/lib/actions/social.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ActionState } from "@/lib/types/actions";

interface MediaAsset {
  id: string;
  url: string;
  kind: string;
  caption: string | null;
  experienceCompany: string | null;
  year: string | null;
}

interface Props {
  media: MediaAsset[];
}

const KIND_OPTIONS = [
  { value: "event", label: "Event" },
  { value: "award", label: "Award" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "promotion", label: "Promotion" },
  { value: "other", label: "Other" },
];

type UploadState = ActionState<{ id: string; url: string }> | null;

export function GalleryManager({ media }: Props) {
  const [state, action, isPending] = useActionState<UploadState, FormData>(
    async (_prev, formData) => uploadMediaAsset(formData),
    null,
  );
  const [isDeleting, startDelete] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Delete this photo?")) return;
    startDelete(() => {
      deleteMediaAsset(id);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <form action={action} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="file">Photo (max 10MB)</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kind">Category</Label>
                <select
                  id="kind"
                  name="kind"
                  className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  defaultValue="event"
                >
                  {KIND_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceCompany">Company (optional)</Label>
                <Input
                  id="experienceCompany"
                  name="experienceCompany"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year (optional)</Label>
                <Input id="year" name="year" placeholder="e.g. 2024" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption (optional)</Label>
              <Input
                id="caption"
                name="caption"
                placeholder="Employee of the Year awards ceremony"
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Uploading..." : "Upload Photo"}
            </Button>
            {state && !state.success && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </form>
        </CardContent>
      </Card>

      {media.length === 0 ? (
        <p className="text-sm text-muted-foreground">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {media.map((asset) => (
            <div key={asset.id} className="group relative overflow-hidden rounded-lg border">
              <div className="relative aspect-square">
                <Image
                  src={asset.url}
                  alt={asset.caption ?? "Gallery photo"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-1 p-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs capitalize">
                    {asset.kind}
                  </Badge>
                  {asset.year && (
                    <span className="text-xs text-muted-foreground">
                      {asset.year}
                    </span>
                  )}
                </div>
                {asset.caption && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {asset.caption}
                  </p>
                )}
                <button
                  onClick={() => handleDelete(asset.id)}
                  disabled={isDeleting}
                  className="text-xs text-destructive hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
