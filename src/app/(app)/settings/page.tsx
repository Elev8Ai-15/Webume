import { auth } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { getUserByClerkId } from "@/lib/repositories/user.repository";
import { PublishCard, SlugCard } from "./settings-cards";

export default async function SettingsPage() {
  const { userId } = await auth();
  const user = userId ? await getUserByClerkId(userId) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your public Webume.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2">
        <PublishCard isPublic={!!user?.isPublic} slug={user?.slug ?? null} />
        <SlugCard slug={user?.slug ?? null} />
      </div>
    </div>
  );
}
