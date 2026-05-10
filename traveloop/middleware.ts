import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];
  const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api/auth');

  // If it's a public path, continue
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for auth token in cookie
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // No token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the token
    verifyJwtToken(token);
    // Token is valid, continue
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Clear the invalid cookie
    response.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
