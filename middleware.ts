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
  '/bookings',
];

// List of auth routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/auth',
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  const authToken = request.cookies.get('authToken')?.value;
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'vi';
  
  // Check if route is protected or auth route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If user is on a protected route and doesn't have a token
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
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

  // Set locale cookie if not present
  const response = NextResponse.next();
  if (!request.cookies.get('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
  
  return response;
}

export const config = {
  // Match all routes except static files and API routes  
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};