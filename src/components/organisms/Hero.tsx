'use client';

import Image from 'next/image';
import { Text, Button } from '../atoms';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('home');

  return (
    <section className="flex flex-col gap-8 items-center sm:items-start">
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      <div className="text-center sm:text-left">
        <Text as="h1" variant="title" className="mb-4">
          {t('title')}
        </Text>
        <Text variant="body" className="text-lg">
          {t('description')}
        </Text>
      </div>
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <a
          href="https://vercel.com/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="md">
            <span className="flex items-center gap-2">
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              {t('deployNow')}
            </span>
          </Button>
        </a>
        <a
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary" size="md">
            {t('readDocs')}
          </Button>
        </a>
      </div>
    </section>
  );
}