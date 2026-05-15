import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { PublicTestimonial } from "@/lib/types";

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
  return (
    <section
      id="testimonials"
      className="border-t border-border py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Trusted by job seekers
          </h2>
        </Reveal>
        {items.length === 0 ? (
          <Reveal className="mx-auto mt-10 max-w-md text-center md:mt-14">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Real quotes from members show up here. After you sign in, you can
              add yours from{" "}
              <Link href="/settings" className="underline underline-offset-4">
                Settings
              </Link>
              .
            </p>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-6 inline-flex"
              )}
            >
              Create free account
            </Link>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 md:grid-cols-3 md:gap-6">
            {items.map((t, i) => (
              <Reveal
                key={t.id}
                className="rounded-lg border border-border bg-card p-5 shadow-none transition-shadow duration-300 hover:shadow-md dark:hover:shadow-primary/5"
                delay={i * 0.07}
              >
                <figure>
                  <StarRow rating={t.rating} />
                  <blockquote className="mt-3 text-sm italic leading-relaxed text-foreground">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4">
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.role}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
