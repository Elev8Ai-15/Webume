"use client";

import { useActionState, useState } from "react";
import { addEndorsement } from "@/lib/actions/social.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/types/actions";

interface Props {
  recipientSlug: string;
  suggestedSkills: string[];
}

export function EndorsementForm({ recipientSlug, suggestedSkills }: Props) {
  const [skill, setSkill] = useState("");
  const [state, action, isPending] = useActionState<ActionState | null, FormData>(
    async (_prev, formData) => {
      const skillValue = formData.get("skill") as string;
      const message = formData.get("message") as string;
      return addEndorsement(
        recipientSlug,
        skillValue,
        message || null,
        null,
      );
    },
    null,
  );

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="skill">Skill to endorse</Label>
        <Input
          id="skill"
          name="skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Leadership, Python, Stakeholder management..."
          required
        />
        {suggestedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {suggestedSkills.slice(0, 8).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSkill(s)}
                className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          name="message"
          rows={2}
          placeholder="I worked with them on X and they excel at..."
        />
      </div>
      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? "Endorsing..." : "Endorse"}
      </Button>
      {state && !state.success && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-500">Thanks for endorsing!</p>
      )}
    </form>
  );
}
