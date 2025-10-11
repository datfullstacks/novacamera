'use client';

import { useRouter } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLocale = (newLocale: string) => {
    if (!mounted) return;
    
    startTransition(() => {
      // Set cookie only on client-side
      if (typeof window !== 'undefined') {
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      }
      // Refresh to apply new locale
      router.refresh();
    });
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex gap-2">
        <div className="px-4 py-2 bg-gray-300 text-gray-500 rounded">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending || locale === 'en'}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        English
      </button>
      <button
        onClick={() => switchLocale('vi')}
        disabled={isPending || locale === 'vi'}
        className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
      >
        Tiếng Việt
      </button>
    </div>
  );
}