"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/actions/stripe.actions";

interface Props {
  planId: string;
}

export function PlanButton({ planId }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleUpgrade() {
    startTransition(async () => {
      const result = await createCheckoutSession(planId);
      if (result.success && result.data.url) {
        window.location.href = result.data.url;
      }
    });
  }

  return (
    <Button onClick={handleUpgrade} disabled={isPending} className="w-full">
      {isPending ? "Loading..." : `Upgrade to ${planId}`}
    </Button>
  );
}
