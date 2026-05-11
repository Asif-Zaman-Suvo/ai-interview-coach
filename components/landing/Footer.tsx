import Link from "next/link";
import { Mic } from "lucide-react";

const footerLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "mailto:hello@interviewcoach.app", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row md:px-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="flex size-7 items-center justify-center rounded-md border border-border bg-background">
            <Mic className="size-3.5 text-foreground" aria-hidden />
          </span>
          <p className="text-xs">
            © 2025 Interview Coach. All rights reserved.
          </p>
        </div>
        <nav
          className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
          aria-label="Footer"
        >
          <Link
            href={footerLinks[0].href}
            className="transition-colors hover:text-foreground"
          >
            {footerLinks[0].label}
          </Link>
          <span className="select-none text-border" aria-hidden>
            ·
          </span>
          <Link
            href={footerLinks[1].href}
            className="transition-colors hover:text-foreground"
          >
            {footerLinks[1].label}
          </Link>
          <span className="select-none text-border" aria-hidden>
            ·
          </span>
          <Link
            href={footerLinks[2].href}
            className="transition-colors hover:text-foreground"
          >
            {footerLinks[2].label}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
