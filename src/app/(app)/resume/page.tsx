import { auth } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { getUserByClerkId } from "@/lib/repositories/user.repository";
import { UploadForm } from "./upload-form";

export default async function ResumePage() {
  const { userId } = await auth();
  const user = userId ? await getUserByClerkId(userId) : null;
  const hasProfile = !!user?.profileData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resume</h1>
        <p className="text-muted-foreground">
          {hasProfile
            ? "Importing a new resume replaces your profile details and career entries. Review your source before continuing."
            : "Upload your resume to get started. Our AI will parse it into a structured profile."}
        </p>
      </div>
      <Separator />
      <div className="mx-auto max-w-lg">
        <UploadForm hasProfile={hasProfile} />
      </div>
    </div>
  );
}
