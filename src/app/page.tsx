import Link from "next/link";

const primaryCta =
  "inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80";
const outlineCta =
  "inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted";

const steps = [
  {
    title: "1. Upload your old resume",
    body: "Any file, any format, any age. Even that PDF from three jobs ago.",
  },
  {
    title: "2. We build your living profile",
    body: "Your history becomes a clean, structured profile you can update in seconds.",
  },
  {
    title: "3. Share your link anywhere",
    body: "One link that is always current — for recruiters, clients, or anyone who asks.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Hero */}
      <section className="px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Webume
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Never rebuild your resume again.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Webume turns your old resume into a living profile. Add jobs,
            photos, and wins as they happen &mdash; so when opportunity shows
            up, you just send your link.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/sign-up" className={primaryCta}>
              Build my Webume &mdash; free
            </Link>
            <Link href="/sign-up" className={outlineCta}>
              Upload your resume &mdash; we&rsquo;ll do the rest
            </Link>
          </div>
        </div>
      </section>

      {/* Pain */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Be honest &mdash; where is your resume right now?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            An old file on a dead laptop? A PDF you&rsquo;d have to rewrite
            from memory? Every job change starts with rebuilding it from
            scratch. That ends today.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="text-center sm:text-left">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Difference */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid overflow-hidden rounded-xl ring-1 ring-foreground/10 sm:grid-cols-2">
            <div className="bg-muted/50 p-8">
              <h3 className="text-lg font-semibold text-muted-foreground">
                A resume
              </h3>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                <li>Static</li>
                <li>Compressed to fit a page</li>
                <li>Rebuilt every job search</li>
                <li>Gets 6 seconds of attention</li>
              </ul>
            </div>
            <div className="bg-card p-8">
              <h3 className="text-lg font-semibold">Your Webume</h3>
              <ul className="mt-4 space-y-3">
                <li>Living</li>
                <li>Grows with you</li>
                <li>Photos and real wins</li>
                <li>One link, forever</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Permanence promise */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Your career home &mdash; free, forever.
          </h2>
          <ul className="mt-6 space-y-3 text-lg text-muted-foreground">
            <li>Free profile and public link forever</li>
            <li>You own your data &mdash; export or delete anytime</li>
            <li>No feed, no followers, no noise</li>
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Ready to make your last resume?
          </h2>
          <div className="mt-8 flex justify-center">
            <Link href="/sign-up" className={primaryCta}>
              Build my Webume &mdash; free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            The last resume you&rsquo;ll ever make.
          </p>
          <nav className="flex gap-6 text-sm">
            <Link
              href="/sign-in"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
