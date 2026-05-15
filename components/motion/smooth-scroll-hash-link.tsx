"use client";

import type { MouseEvent } from "react";

const SHEET_CLOSE_SCROLL_MS = 260;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function scrollToHash(hash: string): boolean {
  if (!hash.startsWith("#")) return false;
  const id = decodeURIComponent(hash.slice(1));
  const el = document.getElementById(id);
  if (!el) return false;
  const behavior = prefersReducedMotion() ? "auto" : "smooth";
  el.scrollIntoView({ behavior, block: "start" });
  window.history.replaceState(null, "", hash);
  return true;
}

type SmoothScrollHashLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  /** Runs first (e.g. close mobile sheet); scroll runs after a short delay. */
  onBeforeScroll?: () => void;
};

export function SmoothScrollHashLink({
  href,
  className,
  children,
  onBeforeScroll,
}: SmoothScrollHashLinkProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    if (!href.startsWith("#")) return;
    const id = decodeURIComponent(href.slice(1));
    const el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();

    if (onBeforeScroll) {
      onBeforeScroll();
      window.setTimeout(() => {
        scrollToHash(href);
      }, SHEET_CLOSE_SCROLL_MS);
      return;
    }

    scrollToHash(href);
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
