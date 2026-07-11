"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateHeader, type HeaderInput } from "@/lib/actions/header.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  initialBasics: HeaderInput["basics"];
  initialSkills: string[];
}

export function HeaderForm({ initialBasics, initialSkills }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [basics, setBasics] = useState(initialBasics);
  const [skillsText, setSkillsText] = useState(initialSkills.join(", "));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set(field: keyof HeaderInput["basics"], value: string) {
    setBasics((b) => ({ ...b, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateHeader({
        basics,
        skills: skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About you</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="header-name">Name</Label>
            <Input
              id="header-name"
              value={basics.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Jane Smith"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="header-title">Title</Label>
            <Input
              id="header-title"
              value={basics.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Operations Manager"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="header-tagline">Tagline</Label>
          <Input
            id="header-tagline"
            value={basics.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            placeholder="One line that sums you up"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="header-summary">Summary</Label>
          <Textarea
            id="header-summary"
            value={basics.summary}
            onChange={(e) => set("summary", e.target.value)}
            placeholder="A short professional summary"
            rows={4}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="header-location">Location</Label>
            <Input
              id="header-location"
              value={basics.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Tampa, FL"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="header-phone">Phone</Label>
            <Input
              id="header-phone"
              value={basics.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(555) 555-5555"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="header-email">Email</Label>
            <Input
              id="header-email"
              type="email"
              value={basics.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="header-linkedin">LinkedIn</Label>
            <Input
              id="header-linkedin"
              value={basics.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              placeholder="linkedin.com/in/you"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="header-website">Website</Label>
          <Input
            id="header-website"
            value={basics.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="https://yoursite.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="header-skills">Skills</Label>
          <Textarea
            id="header-skills"
            value={skillsText}
            onChange={(e) => {
              setSkillsText(e.target.value);
              setSaved(false);
            }}
            placeholder="Leadership, Scheduling, P&L management (comma-separated)"
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            Separate skills with commas.
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Saving..." : "Save details"}
          </Button>
          {saved && (
            <p className="text-sm text-muted-foreground">Saved.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
