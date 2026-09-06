"use client";
import { useState, useTransition } from "react";
import {
  submitTestimonial,
  type TestimonialResponse,
} from "@/lib/actions/testimonial.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
export function RecommendationForm({ token }: { token: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <div role="status" className="rounded-2xl border border-primary/30 p-8">
        <h2 className="text-2xl">Thank you for sharing your perspective.</h2>
        <p className="mt-4 text-muted-foreground">
          Your recommendation is private until the profile owner approves it.
        </p>
      </div>
    );
  return (
    <form
      className="space-y-5 rounded-2xl border border-white/10 bg-card p-6 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setError("");
        startTransition(async () => {
          const result = await submitTestimonial(
            token,
            Object.fromEntries(data) as TestimonialResponse,
          );
          if (result.success) setSent(true);
          else setError(result.error);
        });
      }}
    >
      <fieldset disabled={pending} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="issuer-name">Your name</Label>
            <Input
              id="issuer-name"
              name="issuerName"
              required
              minLength={2}
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issuer-email">Your email (private)</Label>
            <Input
              id="issuer-email"
              name="issuerEmail"
              type="email"
              required
              maxLength={200}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="relationship">Your relationship</Label>
          <select
            id="relationship"
            name="relationship"
            required
            className="min-h-11 w-full rounded-lg border bg-background px-3 text-sm"
          >
            {[
              "Coworker",
              "Manager",
              "Direct report",
              "Client",
              "Professional collaborator",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company (optional)</Label>
          <Input id="company" name="sharedCompany" maxLength={200} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recommendation">Your recommendation</Label>
          <Textarea
            id="recommendation"
            name="body"
            required
            minLength={20}
            maxLength={3000}
            rows={6}
          />
          <p className="text-xs text-muted-foreground">
            20–3,000 characters. Specific examples help readers understand the
            work.
          </p>
        </div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" required className="mt-1" />I agree that my
          name, relationship, and recommendation may appear on this person’s
          public portfolio.
        </label>
        <Button type="submit">
          {pending ? "Submitting…" : "Submit for review"}
        </Button>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
