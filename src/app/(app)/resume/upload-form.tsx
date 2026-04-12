"use client";

import { useActionState, useRef } from "react";
import { uploadAndParseResume } from "@/lib/actions/resume.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ActionState } from "@/lib/types/actions";
import type { ProfileData } from "@/lib/types/profile";

type UploadState = ActionState<{ profileData: ProfileData }> | null;

export function UploadForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, action, isPending] = useActionState<UploadState, FormData>(
    async (_prev, formData) => {
      return uploadAndParseResume(formData);
    },
    null,
  );

  return (
    <Card>
      <CardContent className="p-6">
        <form action={action} className="space-y-4">
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Upload your resume (PDF, TXT, or DOCX)
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Max 5MB</p>
            <input
              ref={fileRef}
              type="file"
              name="resume"
              accept=".pdf,.txt,.docx"
              className="mt-4 text-sm"
              required
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Parsing with AI..." : "Upload & Parse Resume"}
          </Button>

          {state && !state.success && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          {state?.success && (
            <p className="text-sm text-green-500">
              Resume parsed successfully! Go to your Profile to review.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
