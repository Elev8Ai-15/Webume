"use client";

import { useActionState } from "react";
import { addComment } from "@/lib/actions/social.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/types/actions";

interface Props {
  recipientSlug: string;
}

export function CommentForm({ recipientSlug }: Props) {
  const [state, action, isPending] = useActionState<ActionState | null, FormData>(
    async (_prev, formData) => {
      const body = formData.get("body") as string;
      return addComment(recipientSlug, body, null);
    },
    null,
  );

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="body">Your comment</Label>
        <Textarea
          id="body"
          name="body"
          rows={3}
          placeholder="Share how you worked together, what they did well, or a specific project..."
          required
        />
      </div>
      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? "Posting..." : "Post Comment"}
      </Button>
      {state && !state.success && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-500">Comment posted!</p>
      )}
    </form>
  );
}
