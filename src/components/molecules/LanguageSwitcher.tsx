'use client';

import { useRouter } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Button, Icon } from '../atoms';

interface LanguageSwitcherProps {
  variant?: 'inline' | 'dropdown';
}

export default function LanguageSwitcher({ variant = 'inline' }: LanguageSwitcherProps) {
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isDropdownOpen && !target.closest('.language-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const switchLocale = (newLocale: string) => {
    if (!mounted) return;
    
    setIsDropdownOpen(false); // Close dropdown after selection
    
    startTransition(() => {
      // Set cookie only on client-side
      if (typeof window !== 'undefined') {
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      }
      // Refresh to apply new locale
      router.refresh();
    });
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  ];

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex gap-2 items-center">
        <Icon name="globe" size={20} className="text-gray-400" />
        <div className="px-3 py-1 text-sm bg-gray-100 rounded">
          Loading...
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex gap-2 items-center">
        <Icon name="globe" size={20} className="text-gray-600" />
        {languages.map((lang) => (
          <Button
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            disabled={isPending || locale === lang.code}
            variant={locale === lang.code ? 'primary' : 'secondary'}
            size="sm"
          >
            {lang.flag} {lang.label}
          </Button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className="relative language-dropdown">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <Icon name="globe" size={16} className="text-gray-600" />
        <span className="flex items-center gap-1">
          {languages.find(lang => lang.code === locale)?.flag}
          {languages.find(lang => lang.code === locale)?.label}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              disabled={isPending || locale === lang.code}
              className={`w-full text-left px-4 py-2 text-sm transition-colors disabled:opacity-50 ${
                locale === lang.code 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
                {locale === lang.code && (
                  <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}