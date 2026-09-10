import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { getUserByClerkId } from "@/lib/repositories/user.repository";
import { getMilestonesForUser } from "@/lib/repositories/career.repository";
import { MilestoneManager } from "./milestone-manager";

export default async function MilestonesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getUserByClerkId(userId);
  if (!user) redirect("/sign-in");

  const [milestones, jobs] = await Promise.all([
    getMilestonesForUser(user.id),
    db.experience.findMany({
      where: { userId: user.id },
      select: { id: true, company: true, role: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Career milestones
        </h1>
        <p className="text-muted-foreground">
          Promotions, key project wins, launches, events, and awards. Attach
          each one to a job and it appears in that chapter on your public page.
        </p>
      </div>
      <Separator />
      <MilestoneManager
        jobs={jobs}
        milestones={milestones.map((m) => ({
          id: m.id,
          kind: m.kind,
          title: m.title,
          description: m.description,
          date: m.date.toISOString(),
          company: m.experience?.company ?? null,
        }))}
      />
    </div>
  );
}
