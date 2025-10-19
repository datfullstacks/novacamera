import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

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
});

// Export navigation utilities (Link, redirect, useRouter, usePathname)
export const { Link, redirect, useRouter, usePathname } = createNavigation(routing);