import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TestimonialManager } from "./testimonial-manager";
export default async function TestimonialsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      experiences: {
        select: { id: true, company: true, role: true },
        orderBy: { displayOrder: "asc" },
      },
    },
  });
  if (!user) redirect("/dashboard");
  const testimonials = await db.testimonial.findMany({
    where: { recipientId: user.id },
    select: {
      id: true,
      issuerName: true,
      issuerEmail: true,
      relationship: true,
      sharedCompany: true,
      body: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-8">
      <div>
        <p className="portfolio-eyebrow">Professional perspective</p>
        <h1 className="mt-3 text-4xl">Testimonials</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Invite someone who knows your work. Review their words before choosing
          what appears on your portfolio.
        </p>
      </div>
      <TestimonialManager
        entries={testimonials.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
        }))}
        experiences={user.experiences}
      />
    </div>
  );
}
