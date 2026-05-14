import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session from cookie
  const sessionCookie = request.cookies.get('better-auth.session_token');

  // For now, we'll do basic path protection
  // In production, you'd verify the session with your backend
  const isAuthenticated = !!sessionCookie;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (!isAuthenticated && !isPublicPath) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based routing (simplified - in production, verify role with backend)
  // For now, we'll use path-based logic
  const isAdminPath = pathname.startsWith('/admin');
  const isDashboardPath = pathname.startsWith('/dashboard');

  // If user tries to access admin paths without admin role, redirect to dashboard
  if (isAdminPath && isAuthenticated) {
    // In production, verify the user's role from the session
    // For now, we'll allow access and let the page handle authorization
    return NextResponse.next();
  }

  // If admin tries to access user dashboard, redirect to admin dashboard
  if (isDashboardPath && isAuthenticated) {
    // In production, check if user is admin and redirect accordingly
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
