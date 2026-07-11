import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getProfileByClerkId } from "@/lib/profile/profile.service";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { TemplatePicker } from "./template-picker";
import type { TemplateId } from "@/lib/types/profile";

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
            You haven&apos;t uploaded a resume yet.{" "}
            <a href="/resume" className="text-primary hover:underline">
              Upload one now
            </a>{" "}
            to build your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Preview your profile and choose a template.
        </p>
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
