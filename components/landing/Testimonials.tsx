const items = [
  {
    quote:
      "I went from blanking on behavioral questions to confidently nailing them. Got the offer in 3 weeks.",
    name: "Sarah K.",
    role: "Frontend Developer at Stripe",
  },
  {
    quote:
      "The resume-based questions were scary accurate. It felt like a real interview. Best free tool I've used.",
    name: "Marcus T.",
    role: "Product Manager at Notion",
  },
  {
    quote:
      "Practiced every day for 2 weeks. The progress tracking kept me motivated. Landed my dream job.",
    name: "Priya R.",
    role: "Data Scientist at Airbnb",
  },
] as const;

export function Testimonials() {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Trusted by job seekers
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 md:grid-cols-3 md:gap-6">
          {items.map((t) => (
            <figure
              key={t.name}
              className="rounded-lg border border-border bg-card p-5 shadow-none"
            >
              <p className="text-sm text-amber-400" aria-label="5 out of 5 stars">
                ★★★★★
              </p>
              <blockquote className="mt-3 text-sm italic leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
