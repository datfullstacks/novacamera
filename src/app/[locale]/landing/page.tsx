import { getTranslations } from 'next-intl/server';
import { CameraLandingTemplate } from '@/components/templates/CameraLandingTemplate';
import {
  HeroSection,
  CategoriesSection,
  FeaturedEquipmentSection,
  ProcessSection,
  TestimonialsSection,
} from '@/components/organisms/landing';

export default async function LandingPage() {
  const t = await getTranslations('landing');

  // Navigation items
  const navigationItems = [
    { label: t('navigation.home'), href: '/', isActive: false },
    { label: t('navigation.rental'), href: '/rental', isActive: false },
    { label: t('navigation.pricing'), href: '/pricing', isActive: false },
    { label: t('navigation.aiAdvisor'), href: '/ai-advisor', isActive: false },
    { label: t('navigation.support'), href: '/support', isActive: false },
    { label: t('navigation.courses'), href: '/courses', isActive: false },
    { label: t('navigation.consignment'), href: '/consignment', isActive: false },
  ];

  // Categories data
  const categories = [
    {
      name: t('categories.items.camera.name'),
      subtitle: t('categories.items.camera.subtitle'),
      image: 'https://placehold.co/225x150',
    },
    {
      name: t('categories.items.lens.name'),
      subtitle: t('categories.items.lens.subtitle'),
      image: 'https://placehold.co/212x265',
    },
    {
      name: t('categories.items.lighting.name'),
      subtitle: t('categories.items.lighting.subtitle'),
      image: 'https://placehold.co/212x318',
    },
    {
      name: t('categories.items.tripod.name'),
      subtitle: t('categories.items.tripod.subtitle'),
      image: 'https://placehold.co/153x153',
    },
    {
      name: t('categories.items.accessories.name'),
      subtitle: t('categories.items.accessories.subtitle'),
      image: 'https://placehold.co/225x150',
    },
  ];

  // Featured equipment data
  const equipment = [
    {
      name: t('featured.equipment.canonR5.name'),
      image: 'https://placehold.co/360x240',
      features: [
        t('featured.equipment.canonR5.features.sensor'),
        t('featured.equipment.canonR5.features.video'),
        t('featured.equipment.canonR5.features.stabilization'),
      ],
      price: t('featured.equipment.canonR5.price'),
    },
    {
      name: t('featured.equipment.sonyA7III.name'),
      image: 'https://placehold.co/512x200',
      features: [
        t('featured.equipment.sonyA7III.features.sensor'),
        t('featured.equipment.sonyA7III.features.video'),
        t('featured.equipment.sonyA7III.features.autofocus'),
      ],
      price: t('featured.equipment.sonyA7III.price'),
    },
    {
      name: t('featured.equipment.canonLens.name'),
      image: 'https://placehold.co/360x540',
      features: [
        t('featured.equipment.canonLens.features.type'),
        t('featured.equipment.canonLens.features.stabilization'),
        t('featured.equipment.canonLens.features.weather'),
      ],
      price: t('featured.equipment.canonLens.price'),
    },
  ];

  // Process steps data
  const steps = [
    {
      number: 1,
      title: t('process.steps.step1.title'),
      description: t('process.steps.step1.description'),
    },
    {
      number: 2,
      title: t('process.steps.step2.title'),
      description: t('process.steps.step2.description'),
    },
    {
      number: 3,
      title: t('process.steps.step3.title'),
      description: t('process.steps.step3.description'),
    },
    {
      number: 4,
      title: t('process.steps.step4.title'),
      description: t('process.steps.step4.description'),
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: t('testimonials.items.testimonial1.quote'),
      authorName: t('testimonials.items.testimonial1.name'),
      authorAvatar: 'https://placehold.co/50x75',
      rating: 5 as const,
    },
    {
      quote: t('testimonials.items.testimonial2.quote'),
      authorName: t('testimonials.items.testimonial2.name'),
      authorAvatar: 'https://placehold.co/50x75',
      rating: 4 as const,
    },
    {
      quote: t('testimonials.items.testimonial3.quote'),
      authorName: t('testimonials.items.testimonial3.name'),
      authorAvatar: 'https://placehold.co/50x75',
      rating: 5 as const,
    },
  ];

  // Footer columns data
  const footerColumns = [
    {
      content: (
        <>
          <strong>{t('footer.company.title')}</strong>
          <br /><br />
          {t('footer.company.hours')}
          <br />
          {t('footer.company.address')}
        </>
      ),
    },
    {
      title: t('footer.support.title'),
      content: (
        <>
          {t('footer.support.sales')}
          <br /><br />
          {t('footer.support.warranty')}
          <br /><br />
          {t('footer.support.portal')}
          <br /><br />
          {t('footer.support.techSupport')}
          <br /><br />
          {t('footer.support.businessEmail')}
        </>
      ),
    },
  ];

  return (
    <CameraLandingTemplate
      navigationItems={navigationItems}
      companyInfo={t('footer.companyInfo')}
      footerColumns={footerColumns}
    >
      {/* Hero Section */}
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        ctaPrimaryText={t('hero.ctaPrimary')}
        ctaSecondaryText={t('hero.ctaSecondary')}
        backgroundImage="https://placehold.co/1181x1477"
      />

      {/* Categories Section */}
      <CategoriesSection title={t('categories.title')} categories={categories} />

      {/* Featured Equipment Section */}
      <FeaturedEquipmentSection title={t('featured.title')} equipment={equipment} />

      {/* Process Section */}
      <ProcessSection title={t('process.title')} steps={steps} />

      {/* Testimonials Section */}
      <TestimonialsSection title={t('testimonials.title')} testimonials={testimonials} />
    </CameraLandingTemplate>
  );
}
