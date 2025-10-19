import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'vi',
  localePrefix: 'never', // Không thêm prefix vào path
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  },
  // Enable locale detection to properly handle root path
  localeDetection: true,
  // Disable pathname-based locale detection since we're using cookies
  pathnames: {
    '/': '/',
    '/login': '/login',
    '/signup': '/signup',
    '/rental': '/rental',
    '/pricing': '/pricing',
    '/support': '/support',
    '/courses': '/courses',
    '/consignment': '/consignment',
    '/ai-advisor': '/ai-advisor',
    '/dashboard': '/dashboard',
    '/profile': '/profile',
    '/orders': '/orders',
    '/cart': '/cart',
    '/settings': '/settings',
    '/equipment': '/equipment',
    '/auth': '/auth',
    '/auth-test': '/auth-test',
    '/bookings': '/bookings',
  }
});