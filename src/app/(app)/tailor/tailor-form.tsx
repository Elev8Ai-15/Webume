"use client";

import { useActionState } from "react";
import { tailorResume } from "@/lib/actions/tailor.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ActionState } from "@/lib/types/actions";
import type { TailorResult } from "@/lib/ai/tailor-resume";

type TailorState = ActionState<TailorResult> | null;

export function TailorForm() {
  const [state, action, isPending] = useActionState<TailorState, FormData>(
    async (_prev, formData) => {
      const jobTitle = formData.get("jobTitle") as string;
      const company = formData.get("company") as string;
      const jobDescription = formData.get("jobDescription") as string;
      const jobUrl = formData.get("jobUrl") as string;

      if (!jobTitle || !company || !jobDescription) {
        return { success: false as const, error: "All fields are required" };
      }

      return tailorResume(jobTitle, company, jobDescription, jobUrl || undefined);
    },
    null,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <form action={action} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="Senior Software Engineer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Google"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job URL (optional)</Label>
              <Input
                id="jobUrl"
                name="jobUrl"
                placeholder="https://..."
                type="url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                placeholder="Paste the full job description here..."
                rows={8}
                required
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Tailoring with AI..." : "Tailor My Resume"}
            </Button>

            {state && !state.success && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </form>
        </CardContent>
      </Card>

      {state?.success && state.data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              Match Score
              <Badge
                variant="outline"
                className={
                  state.data.matchAnalysis.overallScore >= 80
                    ? "border-green-500 text-green-500"
                    : state.data.matchAnalysis.overallScore >= 60
                      ? "border-yellow-500 text-yellow-500"
                      : "border-red-500 text-red-500"
                }
              >
                {state.data.matchAnalysis.overallScore}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Matched Keywords</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {state.data.matchAnalysis.matchedKeywords.map((k) => (
                  <Badge key={k} variant="outline" className="text-xs">
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
            {state.data.matchAnalysis.strengths.length > 0 && (
              <div>
                <p className="text-sm font-medium">Strengths</p>
                <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                  {state.data.matchAnalysis.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {state.data.matchAnalysis.suggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium">Suggestions</p>
                <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                  {state.data.matchAnalysis.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
