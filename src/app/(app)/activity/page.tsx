import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getUserByClerkId } from "@/lib/repositories/user.repository";
import { getActivityForUser } from "@/lib/repositories/social.repository";
import { ActivityManager } from "./activity-manager";

export default async function ActivityPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getUserByClerkId(userId);
  if (!user) redirect("/sign-in");

  const activities = await getActivityForUser(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Career Activity Feed
        </h1>
        <p className="text-muted-foreground">
          Track promotions, reviews, awards, and milestones as your career
          evolves.
        </p>
      </div>
      <Separator />
      <ActivityManager
        activities={activities.map((a) => ({
          ...a,
          date: a.date.toISOString(),
        }))}
      />
    </div>
  );
}
