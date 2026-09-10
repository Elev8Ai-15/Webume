interface Testimonial {
  id: string;
  issuerName: string;
  relationship: string;
  sharedCompany: string | null;
  body: string;
}

export function TestimonialsDisplay({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!testimonials.length) return null;
  return (
    <section aria-labelledby="testimonials-title">
      <p className="portfolio-eyebrow">Professional perspective</p>
      <h2 id="testimonials-title" className="mt-3 text-3xl">
        In their words.
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {testimonials.map((t) => (
          <figure key={t.id} className="border-l border-primary/40 pl-5">
            <blockquote className="text-base leading-relaxed text-foreground/90">
              {t.body}
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold">{t.issuerName}</span>
              <span className="mt-1 block text-muted-foreground">
                {[t.relationship, t.sharedCompany].filter(Boolean).join(" · ")}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
