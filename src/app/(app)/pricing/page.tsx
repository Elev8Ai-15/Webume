import { auth } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserByClerkId } from "@/lib/repositories/user.repository";
import { PLANS } from "@/lib/stripe/plans";
import { PlanButton } from "./plan-button";

export default async function PricingPage() {
  const { userId } = await auth();
  const user = userId ? await getUserByClerkId(userId) : null;
  const currentPlan = user?.subscription?.planId ?? "free";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-muted-foreground">
          Choose the plan that fits your career goals.
        </p>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        {Object.values(PLANS).map((plan) => (
          <Card
            key={plan.id}
            className={
              currentPlan === plan.id ? "border-primary" : undefined
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {currentPlan === plan.id && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Current
                  </Badge>
                )}
              </div>
              <p className="text-3xl font-bold">
                {plan.price === 0
                  ? "Free"
                  : `$${(plan.price / 100).toFixed(2)}`}
                {plan.price > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    /mo
                  </span>
                )}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="text-muted-foreground">
                    {f}
                  </li>
                ))}
              </ul>
              {plan.id !== "free" && currentPlan !== plan.id && (
                <PlanButton planId={plan.id} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
