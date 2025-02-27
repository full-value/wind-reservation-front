import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const userRole = req.cookies.get('userRole')?.value || null;

  // Redirect root `/` to `/dashboard`
  if (url === '/') {
    return NextResponse.redirect(new URL('/chat', req.url));
  }

  if (url.startsWith('/dashboard')) {
    if (userRole !== "manager") {
      return NextResponse.redirect(new URL('/chat', req.url));
    }
    return NextResponse.next();
  }

  // Skip middleware for specific paths (auth, API, static assets)
  if (
    url.startsWith('/_next/') ||
    url.startsWith('/assets/') ||
    url === '/maintenance' ||
    url.startsWith('/auth/') || // Exclude all auth routes
    url.startsWith('/api/')    // Exclude all API requests
  ) {
    return NextResponse.next();
  }

  // Check for authentication token
  const accessToken = req.cookies.get('accessToken')?.value || null;
  if (!accessToken) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

// Exclude auth, API routes, and static assets from middleware execution
export const config = {
  matcher: ['/((?!_next/|assets/|api/|auth/|maintenance).*)'],
};
