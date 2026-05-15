import {
  Mic2,
  MessageSquare,
  FileText,
  BarChart2,
  Zap,
  BookOpen,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const features = [
  {
    icon: Mic2,
    title: "AI interviewer",
    description:
      "Practice with an AI that asks role-specific questions tailored to your experience level.",
  },
  {
    icon: MessageSquare,
    title: "Real-time feedback",
    description:
      "Get instant scoring and detailed feedback on every answer as you speak.",
  },
  {
    icon: FileText,
    title: "Resume-based questions",
    description:
      "Upload your resume and get questions specifically generated from your background.",
  },
  {
    icon: BarChart2,
    title: "Progress tracking",
    description:
      "Track your improvement over time with detailed analytics and score history.",
  },
  {
    icon: Zap,
    title: "Speech recognition",
    description:
      "Speak naturally — your answers are transcribed in real time using your browser.",
  },
  {
    icon: BookOpen,
    title: "50+ job roles",
    description:
      "From frontend engineers to product managers — we cover all major tech roles.",
  },
] as const;

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-24 py-20 md:scroll-mt-28 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Features
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Everything you need to ace your interview
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 md:grid-cols-3 md:gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal
                key={f.title}
                className="rounded-lg border border-border bg-card p-5 shadow-none transition-shadow duration-300 hover:shadow-md dark:hover:shadow-primary/5"
                delay={i * 0.06}
              >
                <div className="mb-3 flex size-8 items-center justify-center rounded-md bg-muted">
                  <Icon className="size-4 text-foreground" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
