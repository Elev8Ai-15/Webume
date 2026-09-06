"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FileUp, ArrowRight } from "lucide-react";
import { uploadAndParseResume } from "@/lib/actions/resume.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ActionState } from "@/lib/types/actions";
import type { ProfileData } from "@/lib/types/profile";

type UploadState = ActionState<{ profileData: ProfileData }> | null;

export function UploadForm({ hasProfile = false }: { hasProfile?: boolean }) {
  const [state, action, isPending] = useActionState<UploadState, FormData>(
    async (_prev, formData) => uploadAndParseResume(formData),
    null,
  );
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 sm:p-10">
        <form action={action} className="space-y-6" aria-busy={isPending}>
          <div className="rounded-2xl border border-dashed border-primary/35 bg-primary/5 p-6 text-center sm:p-10">
            <FileUp
              className="mx-auto mb-5 h-9 w-9 text-primary"
              strokeWidth={1.25}
              aria-hidden="true"
            />
            <label
              htmlFor="resume-file"
              className="block font-heading text-2xl"
            >
              Your next chapter starts here.
            </label>
            <p
              id="upload-help"
              className="mt-3 text-sm leading-relaxed text-muted-foreground"
            >
              Choose a PDF or TXT resume, up to 4 MB.
            </p>
            <input
              id="resume-file"
              type="file"
              name="resume"
              accept=".pdf,.txt"
              aria-describedby="upload-help"
              className="mt-6 w-full min-w-0 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-3 file:text-foreground"
              required
              disabled={isPending}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.setCustomValidity(
                  file && file.size > 4 * 1024 * 1024
                    ? "Choose a file smaller than 4 MB."
                    : "",
                );
                event.currentTarget.reportValidity();
              }}
            />
          </div>
          {hasProfile && (
            <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
              <input
                type="checkbox"
                name="replaceConfirmed"
                value="yes"
                required
                disabled={isPending}
                className="mt-1 h-4 w-4 shrink-0 accent-[#d95a6b]"
              />
              I understand this replaces my current profile details and career
              entries, including manual edits.
            </label>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="min-h-12 w-full"
          >
            {isPending ? "Reading your resume…" : "Build my profile"}
            <ArrowRight aria-hidden="true" />
          </Button>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Review the extracted details before sharing. Your original file is
            not published.
          </p>
          {state && !state.success && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}
          {state?.success && (
            <div
              role="status"
              className="rounded-xl border border-primary/30 p-4 text-sm"
            >
              Your profile is ready to review.{" "}
              <Link
                href="/profile/edit"
                className="font-semibold text-primary underline underline-offset-4"
              >
                Review your details
              </Link>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
