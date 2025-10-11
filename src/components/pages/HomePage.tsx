'use client';

import { Hero } from '../organisms';
import { LanguageSwitcher } from '../molecules';
import { Text } from '../atoms';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="flex flex-col gap-8">
      <LanguageSwitcher variant="inline" />
      <Hero />
      <section className="mt-8">
        <Text as="h2" variant="heading" className="mb-4">
          {t('gettingStarted')}
        </Text>
        <ol className="font-mono list-inside list-decimal text-sm/6">
          <li className="mb-2 tracking-[-.01em]">
            {t('editFile')}{' '}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            {t('saveChanges')}
          </li>
        </ol>
      </section>
    </div>
  );
}