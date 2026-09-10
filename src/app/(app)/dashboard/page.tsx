import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  FileUp,
  Eye,
  Globe2,
  Check,
} from "lucide-react";
import { CopyLinkButton } from "@/components/copy-link-button";
import { buttonVariants } from "@/components/ui/button-variants";
import { getProfileByClerkId } from "@/lib/profile/profile.service";
import { isPremiumUser } from "@/lib/stripe/plans";

export default async function DashboardPage() {
  const { userId } = await auth();
  const result = userId ? await getProfileByClerkId(userId) : null;
  const user = result?.user;
  const profile = result?.profileData;
  const hasProfile = !!profile;
  const live = !!(hasProfile && user?.isPublic && user.slug);
  const plan = user?.subscription?.planId ?? "free";
  const firstName = (profile?.basics.name || user?.name || "")
    .trim()
    .split(" ")[0];
  const steps = [
    {
      title: "Build your profile",
      detail: "Import a resume or start with your own words.",
      href: "/profile/edit",
      done: hasProfile,
    },
    {
      title: "Shape your career story",
      detail: "Review your roles, skills, and the results behind them.",
      href: "/profile/edit",
      done: !!profile?.experience.length,
    },
    {
      title: "Share your Careerory",
      detail: "Publish a link you can use in your next application.",
      href: "/settings",
      done: live,
    },
  ];
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="portfolio-eyebrow">Your career workspace</p>
          <h1 className="mt-3 text-3xl sm:text-4xl">
            {firstName ? `Welcome back, ${firstName}.` : "Your next chapter."}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Build a career profile you’re proud to share.
          </p>
        </div>
        <Link
          href={hasProfile ? "/profile" : "/resume"}
          className={buttonVariants({ variant: "outline" })}
        >
          {hasProfile ? "Preview portfolio" : "Import resume"}
          <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <section
        className="workspace-feature grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.4fr_1fr]"
        aria-labelledby="next-action"
      >
        <div>
          <p className="portfolio-eyebrow">
            {live ? "Published portfolio" : "Your next step"}
          </p>
          <h2
            id="next-action"
            className="mt-4 max-w-lg text-3xl leading-tight sm:text-4xl"
          >
            {live
              ? "Your experience, out in the world."
              : hasProfile
                ? "Ready when you are."
                : "Give your experience a home."}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            {live
              ? "Keep your career story current and share it with your next opportunity."
              : hasProfile
                ? "Review your profile, choose your address, and publish when it tells your story."
                : "Start with your resume. Shape it into a living portfolio of the work, people, and results that define your career."}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={
                live ? "/profile/edit" : hasProfile ? "/settings" : "/resume"
              }
              className={buttonVariants()}
            >
              {live
                ? "Update my profile"
                : hasProfile
                  ? "Review publishing settings"
                  : "Import my resume"}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            {!hasProfile && (
              <Link
                href="/profile/edit"
                className="px-2 py-3 text-sm text-muted-foreground hover:text-foreground"
              >
                Start from scratch
              </Link>
            )}
            {live && user?.slug && <CopyLinkButton slug={user.slug} />}
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-background/50 p-6">
          <div className="flex items-center justify-between">
            <BookOpen
              className="h-6 w-6 text-primary"
              strokeWidth={1.25}
              aria-hidden="true"
            />
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs">
              {live ? "Published" : "Private draft"}
            </span>
          </div>
          <div className="py-6">
            <p className="font-heading text-2xl">
              {profile?.basics.name || "Your professional portfolio"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {profile?.basics.title || "Your experience. Your story."}
            </p>
          </div>
          {live && user?.slug ? (
            <Link
              href={`/p/${user.slug}`}
              className="flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-primary"
            >
              <span className="break-all">/p/{user.slug}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          ) : (
            <p className="border-t border-white/10 pt-4 text-sm text-muted-foreground">
              Only you can see your draft.
            </p>
          )}
        </div>
      </section>
      <section
        aria-label="Portfolio at a glance"
        className="grid gap-4 sm:grid-cols-3"
      >
        {[
          {
            label: "Profile views",
            value: user?.profileViews ?? 0,
            detail: "Total non-owner page views",
            icon: Eye,
          },
          {
            label: "Career chapters",
            value: profile?.experience.length ?? 0,
            detail: "Roles in your portfolio",
            icon: BookOpen,
          },
          {
            label: "Your plan",
            value: plan,
            detail: "Your public profile stays free",
            icon: Globe2,
          },
        ].map(({ label, value, detail, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-card/50 p-6"
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {label}
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <p className="mt-4 font-heading text-3xl capitalize">{value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
          </div>
        ))}
      </section>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="text-2xl">Make it yours.</h2>
          <div className="mt-5 divide-y divide-white/10">
            {steps.map((step, i) => (
              <Link
                href={step.href}
                key={step.title}
                className="group flex items-center gap-4 py-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-sm text-primary">
                  {step.done ? (
                    <Check className="h-4 w-4" aria-label="Complete" />
                  ) : (
                    `0${i + 1}`
                  )}
                </span>
                <div>
                  <h3 className="font-sans text-base font-medium">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
                <ArrowUpRight
                  className="ml-auto h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-white/10 p-6 sm:p-8">
          <FileUp
            className="h-6 w-6 text-primary"
            strokeWidth={1.25}
            aria-hidden="true"
          />
          <h2 className="mt-5 text-2xl">For the application.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            When an employer needs a file, Pro turns your profile into a clean,
            single-column resume PDF.
          </p>
          <div className="mt-6">
            {hasProfile && isPremiumUser(user?.subscription) ? (
              <a
                href="/api/export/ats"
                className={buttonVariants({ variant: "outline" })}
              >
                Download resume PDF
              </a>
            ) : (
              <Link
                href="/pricing"
                className="text-sm font-medium text-primary hover:underline"
              >
                Explore Pro <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
