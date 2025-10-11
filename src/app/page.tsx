'use client';

import { useTranslations } from "next-intl";
import { CameraLandingTemplate } from "@/components/templates/CameraLandingTemplate";
import Header from "@/components/organisms/Header";
import {
  HeroSection,
  // CategoriesSection,
  FeaturedEquipmentSection,
  ProcessSection,
  TestimonialsSection,
  LandingFooter,
} from "@/components/organisms/landing";
import { useRouter } from 'next/navigation';
import ChatProvider from "@/components/layout/ChatProvider";

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations("landing");

  // Handle rent equipment click
  const handleRentClick = (equipmentName: string) => {
    console.log('Rent clicked for:', equipmentName);
    router.push('/rental');
  };

  // Categories data (temporarily disabled)
  const categories = [
    {
      name: t("categories.items.camera.name"),
      subtitle: t("categories.items.camera.subtitle"),
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=225&h=150&fit=crop&q=80"
    },
    {
      
      name: t("categories.items.lens.name"),
      subtitle: t("categories.items.lens.subtitle"),
      image: "https://digi4u.net/media/product/2471294_2_700x700_0.jpg",
    },
    {
      name: t("categories.items.lighting.name"),
      subtitle: t("categories.items.lighting.subtitle"),
      image:
        "https://png.pngtree.com/png-clipart/20250415/original/pngtree-studio-spotlight-professional-stage-lighting-equipment-png-image_20745968.png",
    },
    {
      name: t("categories.items.tripod.name"),
      subtitle: t("categories.items.tripod.subtitle"),
      image:
        "data:image/jpeg;base64,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",
    },
    {
      name: t("categories.items.accessories.name"),
      subtitle: t("categories.items.accessories.subtitle"),
      image:
        "https://mayanhcuvn.com/wp-content/uploads/2025/04/phu-kien-may-anh-1.jpeg",
    },
  ];

  // Featured equipment data
  const equipment = [
    {
      name: t("featured.equipment.canonR5.name"),
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=360&h=240&fit=crop",
      features: [
        t("featured.equipment.canonR5.features.sensor"),
        t("featured.equipment.canonR5.features.video"),
        t("featured.equipment.canonR5.features.stabilization"),
      ],
      price: t("featured.equipment.canonR5.price"),
      onRentClick: () => handleRentClick("Canon EOS R5"),
    },
    {
      name: t("featured.equipment.sonyA7III.name"),
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=512&h=200&fit=crop",
      features: [
        t("featured.equipment.sonyA7III.features.sensor"),
        t("featured.equipment.sonyA7III.features.video"),
        t("featured.equipment.sonyA7III.features.autofocus"),
      ],
      price: t("featured.equipment.sonyA7III.price"),
      onRentClick: () => handleRentClick("Sony Alpha A7III"),
    },
    {
      name: t("featured.equipment.canonLens.name"),
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=360&h=540&fit=crop",
      features: [
        t("featured.equipment.canonLens.features.type"),
        t("featured.equipment.canonLens.features.stabilization"),
        t("featured.equipment.canonLens.features.weather"),
      ],
      price: t("featured.equipment.canonLens.price"),
      onRentClick: () => handleRentClick("Canon RF 24-70mm f/2.8L"),
    },
  ];

  // Process steps data
  const steps = [
    {
      number: 1,
      title: t("process.steps.step1.title"),
      description: t("process.steps.step1.description"),
    },
    {
      number: 2,
      title: t("process.steps.step2.title"),
      description: t("process.steps.step2.description"),
    },
    {
      number: 3,
      title: t("process.steps.step3.title"),
      description: t("process.steps.step3.description"),
    },
    {
      number: 4,
      title: t("process.steps.step4.title"),
      description: t("process.steps.step4.description"),
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: t("testimonials.items.testimonial1.quote"),
      authorName: t("testimonials.items.testimonial1.author"),
      authorAvatar: "https://placehold.co/50x75",
      rating: 5 as const,
    },
    {
      quote: t("testimonials.items.testimonial2.quote"),
      authorName: t("testimonials.items.testimonial2.author"),
      authorAvatar: "https://placehold.co/50x75",
      rating: 4 as const,
    },
    {
      quote: t("testimonials.items.testimonial3.quote"),
      authorName: t("testimonials.items.testimonial3.author"),
      authorAvatar: "https://placehold.co/50x75",
      rating: 5 as const,
    },
  ];

  // Footer columns data
  const footerColumns = [
    {
      title: t("footer.company.title"),
      content: (
        <>
          {t("footer.company.description")}
          <br />
          <br />
          {t("footer.company.mission")}
        </>
      ),
    },
    {
      title: t("footer.services.title"),
      content: (
        <>
          {t("footer.services.rental")}
          <br />
          {t("footer.services.consulting")}
          <br />
          {t("footer.services.courses")}
          <br />
          {t("footer.services.maintenance")}
        </>
      ),
    },
    {
      title: t("footer.contact.title"),
      content: (
        <>
          {t("footer.contact.address")}
          <br />
          {t("footer.contact.phone")}
          <br />
          {t("footer.contact.email")}
        </>
      ),
    },
    {
      title: t("footer.support.title"),
      content: (
        <>
          {t("footer.support.hotline")}
          <br />
          {t("footer.support.technical")}
          <br />
          <br />
          {t("footer.support.businessEmail")}
        </>
      ),
    },
  ];

  // Navigation items
  const navigationItems = [
    { label: t("navigation.home"), href: "/", isActive: true },
    { label: t("navigation.rental"), href: "/rental" },
    { label: t("navigation.pricing"), href: "/pricing" },
    { label: t("navigation.support"), href: "/support" },
  ];

  return (
    <ChatProvider>
      <CameraLandingTemplate
        navigationItems={navigationItems}
        companyInfo={t("footer.company.description")}
        footerColumns={footerColumns}
      >
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <HeroSection
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          ctaPrimaryText={t("hero.ctaPrimary")}
          ctaSecondaryText={t("hero.ctaSecondary")}
          backgroundImage="https://placehold.co/1181x1477"
        />

        {/* Categories Section */}
        {/* <CategoriesSection
          title={t("categories.title")}
          categories={categories}
        /> */}

        {/* Featured Equipment Section - Full width background */}
        <FeaturedEquipmentSection
          title={t("featured.title")}
          equipment={equipment}
          rentButtonText={t("featured.rentButton")}
        />

        {/* Process Section */}
        <ProcessSection title={t("process.title")} steps={steps} />

        {/* Testimonials Section - Full width background */}
        <TestimonialsSection
          title={t("testimonials.title")}
          testimonials={testimonials}
        />

        {/* Footer */}
        <LandingFooter
          companyInfo={t("footer.company.description")}
          columns={footerColumns}
        />
      </CameraLandingTemplate>
    </ChatProvider>
  );
}
