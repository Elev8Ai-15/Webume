"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/actions/stripe.actions";

interface Props {
  planId: string;
}

export function PlanButton({ planId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleUpgrade() {
    setError(null);
    startTransition(async () => {
      const result = await createCheckoutSession(planId);
      if (result.success && result.data.url) {
        window.location.href = result.data.url;
      } else if (!result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleUpgrade} disabled={isPending} className="w-full">
        {isPending ? "Loading..." : `Upgrade to ${planId}`}
      </Button>
      {error && <p className="text-sm text-muted-foreground">{error}</p>}
    </div>
  );
}
