"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createTestimonialRequest,
  reviewTestimonial,
} from "@/lib/actions/testimonial.actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
type Entry = {
  id: string;
  issuerName: string;
  issuerEmail: string;
  relationship: string;
  sharedCompany: string | null;
  body: string;
  status: string;
  createdAt: string;
};
export function TestimonialManager({
  entries,
  experiences,
}: {
  entries: Entry[];
  experiences: { id: string; company: string; role: string }[];
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [job, setJob] = useState("");
  const router = useRouter();
  function review(id: string, status: "approved" | "rejected") {
    setMessage("");
    startTransition(async () => {
      const result = await reviewTestimonial(id, status);
      setMessage(result.success ? "Review saved." : result.error);
      if (result.success) router.refresh();
    });
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Request a recommendation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="testimonial-job">Career chapter</Label>
          <select
            id="testimonial-job"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="min-h-11 w-full rounded-lg border bg-background px-3 text-sm"
          >
            <option value="">Entire portfolio</option>
            {experiences.map((e) => (
              <option key={e.id} value={e.id}>
                {e.company} · {e.role}
              </option>
            ))}
          </select>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Create a private link to send yourself. Each link accepts one
            response within seven days. Nothing is emailed automatically.
          </p>
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setMessage("");
                const result = await createTestimonialRequest(job || undefined);
                if (result.success) {
                  setUrl(
                    `${window.location.origin}/recommend/${result.data.token}`,
                  );
                  router.refresh();
                } else setMessage(result.error);
              })
            }
          >
            Create request link
          </Button>
          {url && (
            <div className="space-y-2">
              <Label htmlFor="request-link">Copy and share this link</Label>
              <input
                id="request-link"
                readOnly
                value={url}
                onFocus={(e) => e.target.select()}
                className="min-h-11 w-full rounded-lg border bg-background px-3 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Share it only with the person you want to respond.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <p role="status" className="text-sm text-muted-foreground">
        {message}
      </p>
      {entries.length === 0 && (
        <p className="py-6 text-center text-muted-foreground">
          No recommendations yet. Start with someone who knows your work.
        </p>
      )}
      {entries.map((t) => (
        <Card key={t.id}>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl">{t.issuerName || "Request link"}</h2>
                {t.issuerName && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[t.relationship, t.sharedCompany]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
              <span className="rounded-full border px-3 py-1 text-xs capitalize">
                {t.status === "invited" ? "Invited · 7-day link" : t.status}
              </span>
            </div>
            {t.body && (
              <p className="whitespace-pre-line text-base leading-relaxed">
                {t.body}
              </p>
            )}
            {t.issuerEmail && (
              <p className="text-xs text-muted-foreground">
                Private contact: {t.issuerEmail}. Identity is self-reported.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {(t.status === "pending" || t.status === "rejected") &&
                t.body && (
                  <Button
                    disabled={pending}
                    onClick={() => review(t.id, "approved")}
                  >
                    Approve for public profile
                  </Button>
                )}
              {t.status !== "rejected" && (
                <Button
                  disabled={pending}
                  variant="outline"
                  onClick={() => review(t.id, "rejected")}
                >
                  {t.status === "invited"
                    ? "Revoke link"
                    : t.status === "approved"
                      ? "Remove from public profile"
                      : "Keep private"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
