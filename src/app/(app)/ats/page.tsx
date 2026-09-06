import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProfileByClerkId } from "@/lib/profile/profile.service";
import { calculateATSScore } from "@/lib/ai/ats-score";

export default async function ATSPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profileResult = await getProfileByClerkId(userId);
  if (!profileResult) redirect("/sign-in");
  const { profileData } = profileResult;

  if (!profileData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ATS Score</h1>
          <p className="text-muted-foreground">
            <a href="/resume" className="text-primary hover:underline">
              Upload your resume
            </a>{" "}
            first to check your ATS compatibility.
          </p>
        </div>
      </div>
    );
  }

  const result = calculateATSScore(profileData);

  const gradeColor = result.grade.startsWith("A")
    ? "text-green-500 border-green-500"
    : result.grade === "B"
      ? "text-yellow-500 border-yellow-500"
      : "text-red-500 border-red-500";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">ATS Score</h1>
        <p className="text-muted-foreground">
          A basic keyword and completeness check. This is not a test against an
          employer’s ATS or a prediction of interview success.
        </p>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">{result.score}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className={gradeColor}>
              Grade: {result.grade}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Keyword Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {result.matches.map((m) => (
                <Badge key={m} variant="outline" className="text-xs">
                  {m}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {result.tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Tips to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {result.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
