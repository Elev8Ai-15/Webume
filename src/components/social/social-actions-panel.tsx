"use client";

import { useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { EndorsementForm } from "./endorsement-form";
import { CommentForm } from "./comment-form";

interface Props {
  recipientSlug: string;
  isOwner: boolean;
  suggestedSkills: string[];
}

export function SocialActionsPanel({
  recipientSlug,
  isOwner,
  suggestedSkills,
}: Props) {
  const { isSignedIn, isLoaded } = useUser();
  const [mode, setMode] = useState<"none" | "endorse" | "comment">("none");

  if (isOwner) return null;

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed border-border p-4">
        <p className="text-sm text-muted-foreground">
          Sign in to endorse or leave a comment.
        </p>
        <SignInButton mode="modal">
          <Button size="sm" variant="outline">
            Sign In
          </Button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      {mode === "none" && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMode("endorse")}
          >
            Endorse
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMode("comment")}
          >
            Leave a Comment
          </Button>
        </div>
      )}

      {mode === "endorse" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Endorse a skill</h3>
            <button
              onClick={() => setMode("none")}
              className="text-xs text-muted-foreground hover:underline"
            >
              Cancel
            </button>
          </div>
          <EndorsementForm
            recipientSlug={recipientSlug}
            suggestedSkills={suggestedSkills}
          />
        </div>
      )}

      {mode === "comment" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Leave a comment</h3>
            <button
              onClick={() => setMode("none")}
              className="text-xs text-muted-foreground hover:underline"
            >
              Cancel
            </button>
          </div>
          <CommentForm recipientSlug={recipientSlug} />
        </div>
      )}
    </div>
  );
}
