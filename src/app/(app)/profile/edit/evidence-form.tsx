"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addDocument,
  removeDocument,
  type DocumentInput,
} from "@/lib/actions/document.actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function EvidenceForm({
  experiences,
  documents,
}: {
  experiences: { id: string; company: string; role: string }[];
  documents: { id: string; title: string; experienceId: string | null }[];
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Career evidence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Attach a sharing link to work samples, awards, or recommendation
          letters. The link appears on that career chapter when your profile is
          public. Access to the document itself is controlled by its host.
        </p>
        {experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add a career chapter first.
          </p>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const input = Object.fromEntries(
                new FormData(form),
              ) as DocumentInput;
              setMessage("");
              startTransition(async () => {
                const result = await addDocument(input);
                setMessage(
                  result.success ? "Evidence link saved." : result.error,
                );
                if (result.success) {
                  form.reset();
                  router.refresh();
                }
              });
            }}
          >
            <fieldset disabled={pending} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="evidence-chapter">Career chapter</Label>
                <select
                  id="evidence-chapter"
                  name="experienceId"
                  required
                  className="min-h-11 w-full rounded-lg border bg-background px-3 text-sm"
                >
                  {experiences.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.company} · {e.role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidence-kind">Type</Label>
                <select
                  id="evidence-kind"
                  name="kind"
                  className="min-h-11 w-full rounded-lg border bg-background px-3 text-sm"
                >
                  {[
                    "project",
                    "award",
                    "certification",
                    "recommendation",
                    "other",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidence-title">Title</Label>
                <Input
                  id="evidence-title"
                  name="title"
                  required
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidence-year">Year (optional)</Label>
                <Input id="evidence-year" name="year" maxLength={50} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="evidence-url">Document sharing link</Label>
                <Input
                  id="evidence-url"
                  name="url"
                  type="url"
                  required
                  maxLength={2000}
                  placeholder="https://"
                />
              </div>
              <Button type="submit">
                {pending ? "Saving…" : "Add evidence link"}
              </Button>
            </fieldset>
          </form>
        )}
        <div className="divide-y divide-white/10">
          {documents.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <span className="text-sm">{d.title}</span>
              <Button
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={() => {
                  if (
                    !window.confirm(
                      "Remove this evidence link from your portfolio? The original document is not deleted.",
                    )
                  )
                    return;
                  startTransition(async () => {
                    const result = await removeDocument(d.id);
                    setMessage(result.success ? "Link removed." : result.error);
                    if (result.success) router.refresh();
                  });
                }}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
