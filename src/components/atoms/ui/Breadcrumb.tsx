'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Route to breadcrumb mapping
const ROUTE_BREADCRUMBS: Record<string, BreadcrumbItem[]> = {
  '/': [{ label: 'Trang chủ', href: '/' }],
  '/rental': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Cho thuê thiết bị', href: '/rental' },
  ],
  '/rental/[id]': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Cho thuê thiết bị', href: '/rental' },
    { label: 'Chi tiết sản phẩm', href: '#' },
  ],
  '/equipment': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Thiết bị', href: '/equipment' },
  ],
  '/equipment/[id]': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Thiết bị', href: '/equipment' },
    { label: 'Chi tiết thiết bị', href: '#' },
  ],
  '/equipment/add': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Thiết bị', href: '/equipment' },
    { label: 'Thêm thiết bị', href: '/equipment/add' },
  ],
  '/cart': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giỏ hàng', href: '/cart' },
  ],
  '/checkout': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giỏ hàng', href: '/cart' },
    { label: 'Thanh toán', href: '/checkout' },
  ],
  '/dashboard': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Bảng điều khiển', href: '/dashboard' },
  ],
  '/profile': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Hồ sơ', href: '/profile' },
  ],
  '/orders': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Đơn hàng', href: '/orders' },
  ],
  '/bookings': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Đặt hàng', href: '/bookings' },
  ],
  '/ai-advisor': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Trợ lý AI', href: '/ai-advisor' },
  ],
  '/login': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Đăng nhập', href: '/login' },
  ],
  '/signup': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Đăng ký', href: '/signup' },
  ],
  '/pricing': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Bảng giá', href: '/pricing' },
  ],
  '/settings': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Cài đặt', href: '/settings' },
  ],
  '/support': [
    { label: 'Trang chủ', href: '/' },
    { label: 'Hỗ trợ', href: '/support' },
  ],
};

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const pathname = usePathname();

  // Get breadcrumb items from props or auto-detect from pathname
  let breadcrumbs = items;

  if (!breadcrumbs) {
    // Try exact match first
    if (pathname in ROUTE_BREADCRUMBS) {
      breadcrumbs = ROUTE_BREADCRUMBS[pathname];
    } else {
      // Try to match dynamic routes (e.g., /rental/9 -> /rental/[id])
      for (const [route, routeBreadcrumbs] of Object.entries(ROUTE_BREADCRUMBS)) {
        if (route.includes('[id]')) {
          const routePattern = route.replace('[id]', '[^/]+');
          const regex = new RegExp(`^${routePattern}$`);
          if (regex.test(pathname)) {
            breadcrumbs = routeBreadcrumbs;
            break;
          }
        }
      }
    }

    // Fallback: generate from pathname
    if (!breadcrumbs) {
      breadcrumbs = [{ label: 'Trang chủ', href: '/' }];
      const segments = pathname.split('/').filter(Boolean);
      let currentPath = '';

      segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === segments.length - 1;
        breadcrumbs!.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: isLast ? '#' : currentPath,
        });
      });
    }
  }

  return (
    <nav
      className={`flex items-center flex-wrap gap-2 text-sm py-2 ${className}`}
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href === '#' ? (
            <span className="text-gray-700 font-medium">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-blue-600 hover:underline transition-colors"
            >
              {item.label}
            </Link>
          )}

          {index < breadcrumbs.length - 1 && (
            <span className="text-gray-400">/</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumb;
