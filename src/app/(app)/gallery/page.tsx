import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getUserByClerkId } from "@/lib/repositories/user.repository";
import { getMediaForUser } from "@/lib/repositories/social.repository";
import { GalleryManager } from "./gallery-manager";

export default async function GalleryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getUserByClerkId(userId);
  if (!user) redirect("/sign-in");

  const media = await getMediaForUser(user.id);
  const experiences = await db.experience.findMany({
    where: { userId: user.id },
    select: { id: true, company: true, role: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Photo Gallery</h1>
        <p className="text-muted-foreground">
          Upload photos from events, fundraisers, awards, and promotions.
        </p>
      </div>
      <Separator />
      <GalleryManager media={media} experiences={experiences} />
    </div>
  );
}
