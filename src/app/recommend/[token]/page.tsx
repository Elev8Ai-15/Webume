export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { RecommendationForm } from "./recommendation-form";
export const metadata = {
  title: "Private recommendation request | Careerory",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function RecommendationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!/^[a-f0-9]{64}$/.test(token)) notFound();
  const request = await getActiveRequest(token);
  if (!request)
    return (
      <main className="mx-auto max-w-xl px-6 py-20">
        <h1 className="text-3xl">This request is no longer available.</h1>
        <p className="mt-4 text-muted-foreground">
          The link has expired, was revoked, or already received a response. Ask
          the profile owner for a new link.
        </p>
      </main>
    );
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="portfolio-eyebrow">Careerory / Recommendation</p>
      <h1 className="mt-4 text-4xl">
        Your experience working with {request.recipient.name}.
      </h1>
      {request.experience && (
        <p className="mt-4 text-muted-foreground">
          {request.experience.company} · {request.experience.role}
        </p>
      )}
      <p className="my-6 text-base leading-relaxed text-muted-foreground">
        Share only what you know firsthand. The profile owner reviews your
        response before publishing it. Your name and recommendation may be
        public; your email is visible only to the owner.
      </p>
      <RecommendationForm token={token} />
    </main>
  );
}

async function getActiveRequest(token: string) {
  return db.testimonial.findFirst({
    where: {
      id: token,
      status: "invited",
      createdAt: { gte: new Date(Date.now() - 7 * 86400000) },
    },
    select: {
      recipient: { select: { name: true } },
      experience: { select: { company: true, role: true } },
    },
  });
}
