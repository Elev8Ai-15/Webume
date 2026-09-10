"use client";

import { useActionState, useTransition } from "react";
import { addMilestone, deleteMilestone } from "@/lib/actions/milestone.actions";
import { MILESTONE_KINDS } from "@/lib/milestone-kinds";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ActionState } from "@/lib/types/actions";

interface Milestone {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  date: string;
  company: string | null;
}

interface Props {
  milestones: Milestone[];
  jobs: { id: string; company: string; role: string }[];
}

const selectClass =
  "flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm";

export function MilestoneManager({ milestones, jobs }: Props) {
  const [state, action, isPending] = useActionState<ActionState | null, FormData>(
    async (_prev, formData) => {
      const kind = formData.get("kind") as string;
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const date = formData.get("date") as string;
      const experienceId = formData.get("experienceId") as string;
      return addMilestone(kind, title, description || null, date, experienceId || null);
    },
    null,
  );
  const [isDeleting, startDelete] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Delete this milestone?")) return;
    startDelete(() => {
      deleteMilestone(id);
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
                <select id="kind" name="kind" className={selectClass} defaultValue="promotion">
                  {Object.entries(MILESTONE_KINDS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
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
              <Input id="title" name="title" placeholder="Promoted to Store Manager" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceId">Job</Label>
              <select
                id="experienceId"
                name="experienceId"
                className={selectClass}
                defaultValue={jobs[0]?.id ?? ""}
              >
                <option value="">Career-wide (no single job)</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.company} · {j.role}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Led the grand opening of the Brandon location: 40 hires, opened on time."
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add milestone"}
            </Button>
            {state && !state.success && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </form>
        </CardContent>
      </Card>

      {milestones.length === 0 ? (
        <p className="text-sm text-muted-foreground">No milestones yet.</p>
      ) : (
        <div className="space-y-3">
          {milestones.map((m) => (
            <Card key={m.id}>
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {MILESTONE_KINDS[m.kind as keyof typeof MILESTONE_KINDS] ?? m.kind}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(m.date).toLocaleDateString()}
                    </span>
                    {m.company && (
                      <span className="text-xs text-muted-foreground">· {m.company}</span>
                    )}
                  </div>
                  <p className="font-medium">{m.title}</p>
                  {m.description && (
                    <p className="text-sm text-muted-foreground">{m.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(m.id)}
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
