'use client';

import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';

interface NavLink {
  label: string;
  href: string;
}

interface NavigationProps {
  links: NavLink[];
  className?: string;
}

export default function Navigation({ links, className = '' }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={`hidden md:flex items-center space-x-6 ${className}`}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link 
            key={link.href} 
            href={link.href}
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive 
                ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                : 'text-gray-700'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}