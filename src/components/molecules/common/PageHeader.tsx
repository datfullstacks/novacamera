'use client';

import { Breadcrumb } from '@/components/atoms/ui/Breadcrumb';

interface PageHeaderProps {
  title?: string;
  description?: string;
  breadcrumbItems?: Array<{ label: string; href: string }>;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'minimal';
}

/**
 * Reusable page header component with breadcrumb
 * Use this in all main pages for consistent layout
 */
export function PageHeader({
  title,
  description,
  breadcrumbItems,
  children,
  className = '',
  variant = 'default',
}: PageHeaderProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Breadcrumb Section */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Breadcrumb items={breadcrumbItems} className="text-sm" />
        </div>
      </div>

      {/* Header Section */}
      {(title || description) && variant === 'default' && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
            {title && (
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-gray-600 max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Minimal Header (just title) */}
      {title && variant === 'minimal' && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {title}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      {children && (
        <div className="px-4 md:px-6 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      )}
    </div>
  );
}

export default PageHeader;
