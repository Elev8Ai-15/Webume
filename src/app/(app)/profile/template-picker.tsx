"use client";

import { useTransition } from "react";
import { updateTemplate } from "@/lib/actions/profile.actions";
import { TEMPLATES } from "@/lib/templates/template-registry";
import { cn } from "@/lib/utils";
import type { TemplateId } from "@/lib/types/profile";

interface Props {
  currentTemplate: TemplateId;
}

export function TemplatePicker({ currentTemplate }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSelect(id: TemplateId) {
    startTransition(() => {
      updateTemplate(id);
    });
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground">Template</h2>
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            disabled={isPending}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
              currentTemplate === t.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-muted-foreground",
            )}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: t.color }}
            />
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
