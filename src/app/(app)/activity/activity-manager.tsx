"use client";

import { useActionState, useTransition } from "react";
import { addActivity, deleteActivity } from "@/lib/actions/social.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ActionState } from "@/lib/types/actions";

interface Activity {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  date: string;
  experienceCompany: string | null;
}

interface Props {
  activities: Activity[];
}

const KIND_OPTIONS = [
  { value: "promotion", label: "Promotion" },
  { value: "review", label: "Performance Review" },
  { value: "award", label: "Award" },
  { value: "project", label: "Project Launch" },
  { value: "certification", label: "Certification" },
  { value: "custom", label: "Other" },
];

export function ActivityManager({ activities }: Props) {
  const [state, action, isPending] = useActionState<ActionState | null, FormData>(
    async (_prev, formData) => {
      const kind = formData.get("kind") as string;
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const date = formData.get("date") as string;
      const company = formData.get("experienceCompany") as string;
      return addActivity(kind, title, description || null, date, company || null);
    },
    null,
  );
  const [isDeleting, startDelete] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Delete this activity?")) return;
    startDelete(() => {
      deleteActivity(id);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <form action={action} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="kind">Type</Label>
                <select
                  id="kind"
                  name="kind"
                  className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  defaultValue="promotion"
                >
                  {KIND_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Promoted to Senior Engineer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceCompany">Company (optional)</Label>
              <Input
                id="experienceCompany"
                name="experienceCompany"
                placeholder="Acme Corp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Recognized for leading the platform migration project..."
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Activity"}
            </Button>
            {state && !state.success && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </form>
        </CardContent>
      </Card>

      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {a.kind}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.date).toLocaleDateString()}
                    </span>
                    {a.experienceCompany && (
                      <span className="text-xs text-muted-foreground">
                        · {a.experienceCompany}
                      </span>
                    )}
                  </div>
                  <p className="font-medium">{a.title}</p>
                  {a.description && (
                    <p className="text-sm text-muted-foreground">
                      {a.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={isDeleting}
                  className="text-xs text-destructive hover:underline"
                >
                  Delete
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
