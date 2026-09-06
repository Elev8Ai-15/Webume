import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Separator } from "@/components/ui/separator";
import { getProfileByClerkId } from "@/lib/profile/profile.service";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { TemplatePicker } from "./template-picker";
import type { TemplateId } from "@/lib/types/profile";
import { isPremiumUser } from "@/lib/stripe/plans";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const result = await getProfileByClerkId(userId);
  if (!result) redirect("/sign-in");
  const { user, profileData } = result;

  if (!profileData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            No profile yet. Upload a resume, or build one by hand.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/resume" className={buttonVariants()}>
            Upload resume
          </Link>
          <Link
            href="/profile/edit"
            className={buttonVariants({ variant: "outline" })}
          >
            Start from scratch
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Preview your profile and choose a template.
          </p>
        </div>
        <div className="flex gap-2">
          {isPremiumUser(user.subscription?.planId ?? "free") ? (
            <a href="/api/export/ats" className={buttonVariants()}>
              Download ATS resume
            </a>
          ) : (
            <Link href="/pricing" className={buttonVariants({ variant: "outline" })}>
              ATS resume &middot; Pro
            </Link>
          )}
          <Link
            href="/profile/edit"
            className={buttonVariants({ variant: "outline" })}
          >
            Edit profile
          </Link>
        </div>
      </div>
      <Separator />

      <TemplatePicker
        currentTemplate={user.selectedTemplate as TemplateId}
      />

      <TemplateRenderer
        profileData={profileData}
        templateId={user.selectedTemplate as TemplateId}
        profilePhoto={user.profilePhoto}
      />
    </div>
  );
}
