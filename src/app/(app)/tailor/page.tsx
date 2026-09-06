import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getUserByClerkId } from "@/lib/repositories/user.repository";
import { isPremiumUser } from "@/lib/stripe/plans";
import { TailorForm } from "./tailor-form";

export default async function TailorPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getUserByClerkId(userId);
  if (!user) redirect("/sign-in");

  const premium = isPremiumUser(user.subscription);
  const hasProfile = !!user.profileData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          AI Resume Tailor
        </h1>
        <p className="text-muted-foreground">
          Tailor your resume for a specific job posting using AI.
        </p>
      </div>
      <Separator />

      {!hasProfile ? (
        <p className="text-sm text-muted-foreground">
          <a href="/resume" className="text-primary hover:underline">
            Upload your resume
          </a>{" "}
          first to use the AI tailor.
        </p>
      ) : !premium ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-lg font-semibold">Pro Feature</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Upgrade to Pro or Enterprise to use the AI Resume Tailor.
          </p>
          <a
            href="/pricing"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            View Plans
          </a>
        </div>
      ) : (
        <TailorForm />
      )}
    </div>
  );
}
