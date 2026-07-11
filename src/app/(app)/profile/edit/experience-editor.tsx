"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createExperience,
  deleteExperience,
  reorderExperiences,
  updateExperience,
  type ExperienceInput,
} from "@/lib/actions/experience.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ExperienceRow {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  responsibilities: string[];
  metrics: { value: string; label: string }[];
}

interface Props {
  experiences: ExperienceRow[];
}

export function ExperienceEditor({ experiences }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function move(index: number, direction: -1 | 1) {
    const ids = experiences.map((e) => e.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    setError(null);
    startTransition(async () => {
      const result = await reorderExperiences(ids);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this experience? This can't be undone.")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteExperience(id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (editingId === id) setEditingId(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Experience</h2>
        {!adding && (
          <Button
            variant="outline"
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
          >
            Add experience
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {experiences.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground">
          No experience yet. Add your first job above.
        </p>
      )}

      {experiences.map((exp, index) =>
        editingId === exp.id ? (
          <ExperienceForm
            key={exp.id}
            title="Edit experience"
            initial={exp}
            onCancel={() => setEditingId(null)}
            onSave={async (input) => {
              const result = await updateExperience(exp.id, input);
              if (result.success) {
                setEditingId(null);
                router.refresh();
              }
              return result.success ? null : result.error;
            }}
          />
        ) : (
          <Card key={exp.id}>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">{exp.role}</p>
                <p className="text-sm text-muted-foreground">
                  {exp.company}
                  {(exp.startDate || exp.endDate) &&
                    ` · ${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ""}`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move up"
                  disabled={isPending || index === 0}
                  onClick={() => move(index, -1)}
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M8 12V4M4.5 7.5 8 4l3.5 3.5" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move down"
                  disabled={isPending || index === experiences.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M8 4v8M4.5 8.5 8 12l3.5-3.5" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => {
                    setEditingId(exp.id);
                    setAdding(false);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleDelete(exp.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ),
      )}

      {adding && (
        <ExperienceForm
          title="Add experience"
          onCancel={() => setAdding(false)}
          onSave={async (input) => {
            const result = await createExperience(input);
            if (result.success) {
              setAdding(false);
              router.refresh();
            }
            return result.success ? null : result.error;
          }}
        />
      )}
    </div>
  );
}

interface FormProps {
  title: string;
  initial?: ExperienceRow;
  onSave: (input: ExperienceInput) => Promise<string | null>;
  onCancel: () => void;
}

function ExperienceForm({ title, initial, onSave, onCancel }: FormProps) {
  const [isPending, startTransition] = useTransition();
  const [company, setCompany] = useState(initial?.company ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    (initial?.responsibilities ?? []).join("\n"),
  );
  const [metrics, setMetrics] = useState<{ value: string; label: string }[]>(
    initial?.metrics.map((m) => ({ value: m.value, label: m.label })) ?? [],
  );
  const [error, setError] = useState<string | null>(null);

  function setMetric(index: number, field: "value" | "label", text: string) {
    setMetrics((ms) =>
      ms.map((m, i) => (i === index ? { ...m, [field]: text } : m)),
    );
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const saveError = await onSave({
        company,
        role,
        startDate,
        endDate,
        description,
        responsibilities: responsibilitiesText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        metrics: metrics.filter((m) => m.value.trim() && m.label.trim()),
      });
      if (saveError) setError(saveError);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="exp-company">Company</Label>
            <Input
              id="exp-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="exp-role">Role</Label>
            <Input
              id="exp-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Store Manager"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="exp-start">Start date</Label>
            <Input
              id="exp-start"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Jan 2020"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="exp-end">End date</Label>
            <Input
              id="exp-end"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Present"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="exp-description">Description</Label>
          <Textarea
            id="exp-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What the job was about"
            rows={3}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="exp-responsibilities">Responsibilities</Label>
          <Textarea
            id="exp-responsibilities"
            value={responsibilitiesText}
            onChange={(e) => setResponsibilitiesText(e.target.value)}
            placeholder={"Led a team of 12\nCut costs 15% year over year"}
            rows={5}
          />
          <p className="text-xs text-muted-foreground">
            One bullet per line.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Metrics</Label>
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={metric.value}
                onChange={(e) => setMetric(index, "value", e.target.value)}
                placeholder="Value ($1.2M, 35, 3x)"
                aria-label={`Metric ${index + 1} value`}
                className="sm:max-w-40"
              />
              <Input
                value={metric.label}
                onChange={(e) => setMetric(index, "label", e.target.value)}
                placeholder="Label (revenue managed)"
                aria-label={`Metric ${index + 1} label`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setMetrics((ms) => ms.filter((_, i) => i !== index))
                }
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMetrics((ms) => [...ms, { value: "", label: "" }])}
          >
            Add metric
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Saving..." : "Save experience"}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
