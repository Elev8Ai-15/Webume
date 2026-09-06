"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  async function handleCopy() {
    setError(false);
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/p/${slug}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(true);
    }
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy link"}
      </Button>
      <span role="status" className="text-sm text-muted-foreground">
        {error
          ? "Copy unavailable. Open your public profile and copy its address."
          : copied
            ? "Link copied."
            : ""}
      </span>
    </span>
  );
}
