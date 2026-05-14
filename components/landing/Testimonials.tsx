import type { PublicTestimonial } from "@/lib/types";

const FALLBACK: PublicTestimonial[] = [
  {
    id: "seed-1",
    rating: 5,
    quote:
      "I went from blanking on behavioral questions to confidently nailing them. Got the offer in 3 weeks.",
    name: "Sarah K.",
    role: "Frontend Developer at Stripe",
  },
  {
    id: "seed-2",
    rating: 5,
    quote:
      "The resume-based questions were scary accurate. It felt like a real interview. Best free tool I've used.",
    name: "Marcus T.",
    role: "Product Manager at Notion",
  },
  {
    id: "seed-3",
    rating: 5,
    quote:
      "Practiced every day for 2 weeks. The progress tracking kept me motivated. Landed my dream job.",
    name: "Priya R.",
    role: "Data Scientist at Airbnb",
  },
];

function StarRow({ rating }: { rating: number }) {
  const n = Math.min(5, Math.max(0, Math.round(Number(rating)) || 0));
  const label = `${n} out of 5 stars`;
  return (
    <p className="text-sm text-amber-400" aria-label={label} title={label}>
      <span aria-hidden>{"★".repeat(n)}</span>
      <span className="text-amber-400/30" aria-hidden>
        {"★".repeat(5 - n)}
      </span>
    </p>
  );
}

export function Testimonials({ items }: { items: PublicTestimonial[] }) {
  const list = items.length > 0 ? items : FALLBACK;

  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Trusted by job seekers
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 md:grid-cols-3 md:gap-6">
          {list.map((t) => (
            <figure
              key={t.id}
              className="rounded-lg border border-border bg-card p-5 shadow-none"
            >
              <StarRow rating={t.rating} />
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
