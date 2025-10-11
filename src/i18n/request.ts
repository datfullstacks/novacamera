import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

// Can be imported from a shared config
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  // Changed default from 'en' to 'vi' to match routing.ts
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'vi';

  // Validate that the incoming `locale` parameter is valid
  if (!['en', 'vi'].includes(locale)) {
    notFound();
  }

  // Load all message files and merge them
  const commonMessages = (await import(`./locales/${locale}/common.json`)).default;
  const landingMessages = (await import(`./locales/${locale}/pages/landing.json`)).default;
  const homeMessages = (await import(`./locales/${locale}/pages/home.json`)).default;
  const loginMessages = (await import(`./locales/${locale}/pages/login.json`)).default;
  const rentalMessages = (await import(`./locales/${locale}/pages/rental.json`)).default;
  const pricingMessages = (await import(`./locales/${locale}/pages/pricing.json`)).default;
  const supportMessages = (await import(`./locales/${locale}/pages/support.json`)).default;
  const coursesMessages = (await import(`./locales/${locale}/pages/courses.json`)).default;
  const consignmentMessages = (await import(`./locales/${locale}/pages/consignment.json`)).default;
  const aiAdvisorMessages = (await import(`./locales/${locale}/pages/ai-advisor.json`)).default;

  const messages = {
    common: commonMessages,
    landing: landingMessages,
    home: homeMessages,
    login: loginMessages,
    rental: rentalMessages,
    pricing: pricingMessages,
    support: supportMessages,
    courses: coursesMessages,
    consignment: consignmentMessages,
    aiAdvisor: aiAdvisorMessages,
  };

  return {
    locale,
    messages
  };
});