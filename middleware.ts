import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected API routes that require authentication
  const protectedApiRoutes = [
    '/api/articles',
    '/api/collaboration',
    '/api/analytics',
    '/api/export',
    '/api/platforms',
    '/api/monetization',
    '/api/publish',
    '/api/users/me',
    '/api/users/search',
  ];

  // Public API routes (no auth required)
  const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/refresh',
    '/api/auth/verify-email',
    '/api/auth/reset-password',
    '/api/auth/forgot-password',
    '/api/oauth',
    '/api/blogs/public',
  ];

  // For API routes, enforce authentication
  if (pathname.startsWith('/api/')) {
    // Allow public routes
    const isPublicRoute = publicApiRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Check if it's a protected route
    const isProtectedRoute = protectedApiRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute) {
      const authHeader = request.headers.get('authorization');
      const hasAuthHeader = authHeader && authHeader.startsWith('Bearer ');

      if (!hasAuthHeader) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized - No access token provided' },
          { status: 401 }
        );
      }
    }
  }

  // For dashboard routes, we can't check localStorage from middleware (server-side)
  // So we'll inject a script that checks auth client-side
  if (pathname.startsWith('/dashboard')) {
    const response = NextResponse.next();

    // Add a header that dashboard pages can check
    response.headers.set('x-middleware-auth-required', 'true');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
  ],
};
