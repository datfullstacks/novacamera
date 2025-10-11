import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// List of protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/orders',
  '/admin',
  '/settings',
  '/cart',
  '/checkout',
];

// List of auth routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
];

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('authToken')?.value;
  
  // Check if current path is protected (remove locale prefix for checking)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  const isProtectedRoute = protectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );
  
  // Check if current path is auth route
  const isAuthRoute = authRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );

  // If user is on a protected route and doesn't have a token
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  // If user is on an auth route and has a token, redirect to dashboard
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For API routes, pass the auth token in headers
  if (pathname.startsWith('/api/') && authToken) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${authToken}`);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Apply i18n middleware for all other requests
  return intlMiddleware(request);
}

export const config = {
  // Skip root path, allow it to go directly to app/page.tsx
  matcher: [
    '/((?!api|_next|_vercel|favicon.ico|robots.txt|.*\\.)(?!^/$).*)'
  ]
};