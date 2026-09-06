import Link from "next/link";

const pillPrimary =
  "lx-shine inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-[15px] font-semibold text-primary-foreground shadow-[0_10px_30px_-8px_var(--glow-1)] transition hover:brightness-110 active:translate-y-px";
const pillOutline =
  "inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-7 text-[15px] font-medium text-foreground backdrop-blur transition-colors hover:border-primary/60 hover:text-primary";

const band = [
  ["$0", "Free forever. No card, no trial clock."],
  ["1", "Link that is always current."],
  ["0", "Resumes you'll ever rebuild again."],
];

const steps = [
  {
    n: "01",
    title: "Upload your old resume",
    body: "Any file, any age. Even that PDF from three jobs ago. Or type it in, no file needed.",
  },
  {
    n: "02",
    title: "We build your living profile",
    body: "Your history becomes a clean, structured profile you can update in seconds.",
  },
  {
    n: "03",
    title: "Share your link anywhere",
    body: "One link for recruiters, clients, or anyone who asks. Never attach a PDF again.",
  },
];

const features = [
  ["Every job is a page", "Photos from the floor, the crew, the awards wall. Not four lines."],
  ["Numbers that matter", "Sales, people trained, ratings. The proof employers scan for."],
  ["Coworkers vouch", "Real people back your story, on the job where it happened."],
  ["One link, forever", "Update it in seconds. Send it in every application."],
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Nav */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-heading text-2xl">Webume</span>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/sign-in" className="px-3 py-2 text-muted-foreground transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link href="/sign-up" className="rounded-full border border-primary/50 px-4 py-2 font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-10 pb-24 sm:pt-16 lg:pb-32">
        <div className="lx-orbs" aria-hidden="true" />
        <div className="lx-atmo" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          {/* Copy */}
          <div className="lx-cascade">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-3 py-1 text-[12px] font-medium tracking-[0.12em] text-primary uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Now live &middot; Free forever
            </span>
            <h1 className="mt-6 text-[clamp(42px,6.2vw,76px)] leading-[1.0] tracking-[-0.02em] text-balance">
              Never rebuild your resume again.
              <br />
              Meet <span className="lx-foil">Webume</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Build your career profile once. Every job gets its own page with
              photos, numbers, and coworkers who vouch for you. Send the link
              instead of a resume.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className={pillPrimary}>
                Build my Webume &mdash; free
              </Link>
              <Link href="/sign-up" className={pillOutline}>
                Upload a resume instead
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Five minutes. No card. You own your data.</p>
          </div>

          {/* Card stack */}
          <div className="lx-stack relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="lx-float absolute -inset-10 -z-10" aria-hidden="true">
              <i className="lx-f1" style={{ left: "6%", top: "12%" }} />
              <i className="lx-f2" style={{ left: "88%", top: "18%" }} />
              <i className="lx-f3" style={{ left: "70%", top: "70%" }} />
            </div>

            {/* Back layer: the old resume */}
            <div className="lx-layer-back lx-glass absolute inset-x-6 -top-6 hidden rounded-2xl p-6 lg:block">
              <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">Before</p>
              <p className="mt-3 font-mono text-[12px] leading-5 text-muted-foreground">
                Bayline Market &mdash; Store Manager, 2015&ndash;Present. Managed daily
                operations. Responsible for staff, scheduling, inventory, and customer
                service. Improved store performance.
              </p>
            </div>

            {/* Middle layer: the Webume job page */}
            <div className="lx-layer-mid lx-gradient-border relative rounded-2xl p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.18em] text-primary uppercase">Your Webume</p>
                  <h3 className="mt-2 text-3xl leading-none">Store Manager</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Bayline Market &middot; 2015 &ndash; Present</p>
                </div>
                <span className="shrink-0 rounded-full border border-primary/40 px-3 py-1 text-[11px] font-medium text-primary">
                  Promoted twice
                </span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {[
                  ["$4.2M", "Annual sales"],
                  ["38", "People trained"],
                  ["4.8★", "Store rating"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-xl border border-white/10 bg-background/60 px-2 py-3 text-center">
                    <p className="font-heading text-2xl text-primary">{v}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">
                {[1, 0.75, 0.55, 0.4].map((o, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-lg bg-gradient-to-br from-[var(--glow-1)]/50 via-[var(--glow-2)]/30 to-secondary"
                    style={{ opacity: o }}
                  />
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">The 2019 remodel &middot; the crew &middot; the awards wall</p>
            </div>

            {/* Front layer: a coworker testimonial */}
            <div className="lx-layer-front lx-beam relative mt-4 max-w-[340px] rounded-2xl p-5 lg:absolute lg:-bottom-16 lg:left-0 lg:mt-0">
              <p className="text-[11px] font-medium tracking-[0.18em] text-primary uppercase">Coworker vouch</p>
              <p className="mt-2 text-[15px] leading-snug">
                &ldquo;We ran the whole 2019 remodel together. Never missed a day, never lost the crew.&rdquo;
              </p>
              <p className="mt-3 text-xs text-muted-foreground">Assistant Manager &middot; worked together 2017&ndash;2021</p>
            </div>
            <p className="mt-6 text-center text-[11px] text-muted-foreground lg:absolute lg:-bottom-24 lg:right-0 lg:mt-0">Example profile</p>
          </div>
        </div>
      </section>

      {/* Gradient stat band */}
      <section className="lx-band relative z-10 px-6 py-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3 sm:divide-x sm:divide-black/15">
          {band.map(([n, l]) => (
            <div key={l} className="flex items-center gap-4 sm:justify-center">
              <p className="font-heading text-5xl leading-none">{n}</p>
              <p className="max-w-[200px] text-sm font-medium leading-snug opacity-85">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[12px] font-medium tracking-[0.28em] text-primary uppercase">How it works</p>
          <h2 className="mt-4 text-center text-4xl text-balance sm:text-5xl">
            From old PDF to a career home in three moves.
          </h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.n} className="lx-glass group relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
                <div
                  className="h-28 rounded-xl bg-gradient-to-br from-[var(--glow-1)]/40 via-[var(--glow-2)]/25 to-transparent"
                  style={{ opacity: 1 - i * 0.2 }}
                  aria-hidden="true"
                />
                <p className="mt-5 font-heading text-3xl text-primary">{s.n}</p>
                <h3 className="mt-2 text-2xl">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="lx-atmo" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="text-[12px] font-medium tracking-[0.28em] text-primary uppercase">Why Webume</p>
            <h2 className="mt-4 text-4xl text-balance sm:text-5xl">
              Be honest &mdash; where is your resume right now?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              An old file on a dead laptop? A PDF you&rsquo;d have to rewrite from
              memory? Every job change starts with rebuilding it from scratch.
              That ends today.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Ten years of real work should not be four lines that get six
              seconds of attention.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(([t, b]) => (
              <div key={t} className="lx-gradient-border rounded-2xl p-5">
                <h3 className="text-xl">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise + CTA */}
      <section className="relative overflow-hidden px-6 py-28">
        <div className="lx-orbs" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-[clamp(36px,5.5vw,64px)] leading-[1.02] text-balance">
            Your career home. <span className="lx-foil">Free, forever.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Free profile and public link. You own your data, export or delete
            anytime. No feed, no followers, no noise.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/sign-up" className={pillPrimary}>
              Build my Webume &mdash; free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-heading text-lg text-muted-foreground">The last resume you&rsquo;ll ever make.</p>
          <nav className="flex gap-6 text-sm">
            <Link href="/sign-in" className="text-muted-foreground transition-colors hover:text-foreground">Sign in</Link>
            <Link href="/sign-up" className="text-muted-foreground transition-colors hover:text-foreground">Sign up</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
