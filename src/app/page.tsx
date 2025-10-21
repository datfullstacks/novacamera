import { getTranslations } from "next-intl/server";
import { CameraLandingTemplate } from "@/components/templates/CameraLandingTemplate";
import Header from "@/components/organisms/Header";
import {
  HeroSection,
  CategoriesSection,
  FeaturedEquipmentSection,
  ProcessSection,
  TestimonialsSection,
} from "@/components/organisms/landing";

export default async function HomePage() {
  const t = await getTranslations("landing");

  // Navigation items
  const navigationItems = [
    { label: t("navigation.home"), href: "/", isActive: true },
    { label: t("navigation.rental"), href: "/rental", isActive: false },
    { label: t("navigation.pricing"), href: "/pricing", isActive: false },
    { label: t("navigation.aiAdvisor"), href: "/ai-advisor", isActive: false },
    { label: t("navigation.support"), href: "/support", isActive: false },
    { label: t("navigation.courses"), href: "/courses", isActive: false },
    {
      label: t("navigation.consignment"),
      href: "/consignment",
      isActive: false,
    },
  ];

  // Categories data
  const categories = [
    {
      id: "camera",
      name: t("categories.items.camera.name"),
      description: t("categories.items.camera.subtitle"),
      imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&q=80",
      itemCount: 25,
      href: "/equipment/public?category=camera",
    },
    {
      id: "lens",
      name: t("categories.items.lens.name"),
      description: t("categories.items.lens.subtitle"),
      imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop&q=80",
      itemCount: 18,
      href: "/equipment/public?category=lens",
    },
    {
      id: "lighting",
      name: t("categories.items.lighting.name"),
      description: t("categories.items.lighting.subtitle"),
      imageUrl: "https://images.unsplash.com/photo-1603317266112-e7cb4a0a5c80?w=400&h=300&fit=crop&q=80",
      itemCount: 12,
      href: "/equipment/public?category=lighting",
    },
    {
      id: "tripod",
      name: t("categories.items.tripod.name"),
      description: t("categories.items.tripod.subtitle"),
      imageUrl: "https://images.unsplash.com/photo-1617387608932-cf44c6ac6b28?w=400&h=300&fit=crop&q=80",
      itemCount: 8,
      href: "/equipment/public?category=tripod",
    },
    {
      id: "accessories",
      name: t("categories.items.accessories.name"),
      description: t("categories.items.accessories.subtitle"),
      imageUrl: "https://images.unsplash.com/photo-1606016159991-f1d0b5e8c634?w=400&h=300&fit=crop&q=80",
      itemCount: 15,
      href: "/equipment/public?category=accessories",
    },
  ];

  // Featured equipment data
  const equipment = [
    {
      name: t("featured.equipment.canonR5.name"),
      image: "https://images.unsplash.com/photo-1606980707556-e2e13052b2d7?w=800&h=600&fit=crop&q=80",
      features: [
        t("featured.equipment.canonR5.features.sensor"),
        t("featured.equipment.canonR5.features.video"),
        t("featured.equipment.canonR5.features.stabilization"),
      ],
      price: t("featured.equipment.canonR5.price"),
    },
    {
      name: t("featured.equipment.sonyA7III.name"),
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop&q=80",
      features: [
        t("featured.equipment.sonyA7III.features.sensor"),
        t("featured.equipment.sonyA7III.features.video"),
        t("featured.equipment.sonyA7III.features.autofocus"),
      ],
      price: t("featured.equipment.sonyA7III.price"),
    },
    {
      name: t("featured.equipment.canonLens.name"),
      image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&h=600&fit=crop&q=80",
      features: [
        t("featured.equipment.canonLens.features.type"),
        t("featured.equipment.canonLens.features.stabilization"),
        t("featured.equipment.canonLens.features.weather"),
      ],
      price: t("featured.equipment.canonLens.price"),
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
      authorAvatar: "https://i.pravatar.cc/150?img=1",
      rating: 5 as const,
    },
    {
      quote: t("testimonials.items.testimonial2.quote"),
      authorName: t("testimonials.items.testimonial2.author"),
      authorAvatar: "https://i.pravatar.cc/150?img=2",
      rating: 4 as const,
    },
    {
      quote: t("testimonials.items.testimonial3.quote"),
      authorName: t("testimonials.items.testimonial3.author"),
      authorAvatar: "https://i.pravatar.cc/150?img=3",
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

  return (
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
        backgroundImage="https://images.unsplash.com/photo-1606980707556-e2e13052b2d7?w=1920&h=1200&fit=crop&q=90&sat=-20&contrast=10"
      />

      {/* Categories Section */}
      <CategoriesSection
        title={t("categories.title")}
        categories={categories}
      />

      {/* Featured Equipment Section */}
      <FeaturedEquipmentSection
        title={t("featured.title")}
        equipment={equipment}
      />

      {/* Process Section */}
      <ProcessSection title={t("process.title")} steps={steps} />

      {/* Testimonials Section */}
      <TestimonialsSection
        title={t("testimonials.title")}
        testimonials={testimonials}
      />
    </CameraLandingTemplate>
  );
}

