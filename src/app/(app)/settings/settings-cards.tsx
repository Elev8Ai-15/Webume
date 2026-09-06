"use client";

import { useState, useTransition } from "react";
import { togglePublic } from "@/lib/actions/profile.actions";
import { updateSlug } from "@/lib/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyLinkButton } from "@/components/copy-link-button";

interface PublishCardProps {
  isPublic: boolean;
  slug: string | null;
}

export function PublishCard({ isPublic, slug }: PublishCardProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      const result = await togglePublic(!isPublic);
      if (!result.success) setError(result.error);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Publish
          {isPublic ? (
            <Badge
              variant="outline"
              className="border-green-500 text-green-500"
            >
              Live
            </Badge>
          ) : (
            <Badge variant="outline">Private</Badge>
          )}
        </CardTitle>
        <CardDescription>
          {isPublic && slug
            ? `Your Webume is live at /p/${slug}`
            : "Your Webume is private. Only you can see it."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <Button
          onClick={handleToggle}
          disabled={isPending || (!isPublic && !slug)}
          variant={isPublic ? "outline" : "default"}
        >
          {isPending ? "Saving..." : isPublic ? "Make private" : "Publish"}
        </Button>
        {isPublic && slug && <CopyLinkButton slug={slug} />}
        {!slug && (
          <p className="text-sm text-muted-foreground">
            Set a public URL below before publishing.
          </p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}

interface SlugCardProps {
  slug: string | null;
}

export function SlugCard({ slug }: SlugCardProps) {
  const [value, setValue] = useState(slug ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateSlug(value);
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public URL</CardTitle>
        <CardDescription>
          Choose the address where your Webume lives.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setSaved(false);
            }}
            placeholder="your-name"
            className="max-w-xs"
            aria-label="Public URL slug"
          />
          <Button
            onClick={handleSave}
            disabled={isPending || !value.trim() || value.trim() === slug}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground break-all">
          /p/{value.trim().toLowerCase() || "your-name"}
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {saved && <p className="text-sm text-green-500">Saved.</p>}
      </CardContent>
    </Card>
  );
}
