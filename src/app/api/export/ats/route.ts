import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProfileByClerkId } from "@/lib/profile/profile.service";
import { isPremiumUser } from "@/lib/stripe/plans";
import { renderAtsResume } from "@/lib/export/ats-resume";

// Pro feature: an ATS-safe traditional resume built from the living profile.
// Single column, standard headings, real text (no tables, no columns, no icons).
export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const result = await getProfileByClerkId(userId);
  if (!result?.profileData)
    return NextResponse.json({ error: "No profile yet" }, { status: 404 });
  if (!isPremiumUser(result.user.subscription)) {
    return NextResponse.json({ error: "Pro feature" }, { status: 402 });
  }

  const pdf = await renderAtsResume(result.profileData);
  const safeName = (result.profileData.basics.name || "resume").replace(
    /[^a-z0-9]+/gi,
    "-",
  );
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}-resume.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
