import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Paths that require a session cookie. Everything else unknown is allowed through
 * so Next.js can render `app/not-found.tsx` (e.g. /resume, typo URLs).
 */
const AUTH_REQUIRED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/settings",
  "/history",
  "/interview",
  "/analytics",
] as const;

function pathnameRequiresAuth(pathname: string): boolean {
  return AUTH_REQUIRED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Unauthenticated users may browse these URLs without redirecting to /login */
function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  const prefixes = [
    "/login",
    "/register",
    "/terms",
    "/privacy",
    "/checkout",
  ] as const;
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isAuthenticated = Boolean(sessionCookie);

  if (!isAuthenticated) {
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }
    if (pathnameRequiresAuth(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Unknown URLs → Next.js resolves to `app/not-found.tsx`
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
