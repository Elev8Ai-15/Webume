import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUserByClerkId } from "@/lib/repositories/user.repository";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = userId ? await getUserByClerkId(userId) : null;

  const hasProfile = !!user?.profileData;
  const planId = user?.subscription?.planId ?? "free";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your resume and public profile.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Profile Status</CardDescription>
            <CardTitle className="flex items-center gap-2">
              {hasProfile ? (
                <Badge variant="outline" className="border-green-500 text-green-500">
                  Ready
                </Badge>
              ) : (
                <Badge variant="outline">No Profile</Badge>
              )}
              {user?.isPublic && (
                <Badge variant="outline" className="border-blue-500 text-blue-500">
                  Public
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasProfile ? (
              <Link href="/profile" className="text-sm text-primary hover:underline">
                Edit your profile
              </Link>
            ) : (
              <Link href="/resume" className="text-sm text-primary hover:underline">
                Upload your resume to get started
              </Link>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Profile Views</CardDescription>
            <CardTitle>{user?.profileViews ?? 0}</CardTitle>
          </CardHeader>
          <CardContent>
            {user?.isPublic && user?.slug ? (
              <Link
                href={`/p/${user.slug}`}
                className="text-sm text-primary hover:underline"
              >
                View public profile
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">
                Publish your profile to start tracking views.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Plan</CardDescription>
            <CardTitle className="capitalize">{planId}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {planId === "free"
                ? "Upgrade for AI Resume Tailor and more."
                : `${planId} plan active.`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
