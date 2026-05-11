import { Fragment } from "react";

const steps = [
  {
    n: "1",
    title: "Choose your role",
    description:
      "Pick the job role and difficulty level you want to practice for.",
  },
  {
    n: "2",
    title: "Answer questions",
    description:
      "Speak your answers naturally. Our AI listens, transcribes, and evaluates in real time.",
  },
  {
    n: "3",
    title: "Get your feedback",
    description:
      "Review your score, strengths, and areas to improve. Practice again to beat your score.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Steps
        </p>
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          How it works
        </h2>

        <div className="mt-10 flex flex-col gap-10 md:mt-14 md:hidden">
          {steps.map((step) => (
            <div key={step.n} className="text-center">
              <div className="mx-auto flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {step.n}
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 hidden items-start justify-center gap-0 md:mt-14 md:flex">
          {steps.map((step, index) => (
            <Fragment key={step.n}>
              {index > 0 && (
                <div
                  className="flex min-w-[2rem] max-w-[4rem] flex-1 items-center self-start pt-3.5"
                  aria-hidden
                >
                  <div className="h-px w-full border-t border-dashed border-border" />
                </div>
              )}
              <article className="w-full max-w-[220px] shrink-0 text-center">
                <div className="mx-auto flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {step.n}
                </div>
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </article>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
