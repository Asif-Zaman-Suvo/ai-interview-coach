import { Reveal } from "@/components/motion/reveal";

const stats = [
  { value: "2,400+", label: "Interviews completed" },
  { value: "89%", label: "Average improvement" },
  { value: "50+", label: "Job roles covered" },
  { value: "4.9★", label: "User satisfaction" },
] as const;

export function StatsBar() {
  return (
    <section className="border-y border-border bg-card py-10 md:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 md:grid-cols-4 md:gap-4 md:px-8">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            className="text-center md:text-left"
            delay={i * 0.05}
          >
            <p className="text-2xl font-semibold text-foreground">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
