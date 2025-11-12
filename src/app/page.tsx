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
      imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=260&h=192&fit=contain&q=80",
      itemCount: 25,
      href: "/rental?category=camera",
    },
    {
      id: "lens",
      name: t("categories.items.lens.name"),
      description: t("categories.items.lens.subtitle"),
      imageUrl: "https://wypozyczalnia.fotopoker.pl/wp-content/uploads/2023/08/Canon-RF-24-70mm-f2.8.png?w=260&h=192&fit=contain",
      itemCount: 18,
      href: "/rental?category=lens",
    },
    {
      id: "lighting",
      name: t("categories.items.lighting.name"),
      description: t("categories.items.lighting.subtitle"),
      imageUrl: "https://bizweb.dktcdn.net/100/507/659/products/softbox-godox-sb-gue95-grid-foldable-octa-6-d6f5db94-d40a-4450-9105-eef4ef339736.jpg?v=1724584681590&w=260&h=192&fit=contain&quality=95",
      itemCount: 12,
      href: "/rental?category=lighting",
    },
    {
      id: "tripod",
      name: t("categories.items.tripod.name"),
      description: t("categories.items.tripod.subtitle"),
      imageUrl: "https://binhminhdigital.com/thumb/images/product/chan-may-anh-sirui-traveler-7a-chinh-hang-1.jpg?w=260&h=192&fit=contain",
      itemCount: 8,
      href: "/rental?category=tripod",
    },
    {
      id: "accessories",
      name: t("categories.items.accessories.name"),
      description: t("categories.items.accessories.subtitle"),
      imageUrl: "https://salt.tikicdn.com/cache/w300/ts/product/33/2e/ab/82acd9278df79c2ee6c7f85f4c55fcef.jpg?w=260&h=192&fit=contain",
      itemCount: 15,
      href: "/rental?category=accessories",
    },
  ];

  // Featured equipment data
  const equipment = [
    {
      name: t("featured.equipment.canonR5.name"),
      image: "https://mayanhtop1.com/upload/filemanager/%E1%BA%A2nh%20trang%20s%E1%BA%A3n%20ph%E1%BA%A9m/canon-r5-01.jpg",
      features: [
        t("featured.equipment.canonR5.features.sensor"),
        t("featured.equipment.canonR5.features.video"),
        t("featured.equipment.canonR5.features.stabilization"),
      ],
      price: t("featured.equipment.canonR5.price"),
    },
    {
      name: t("featured.equipment.sonyA7III.name"),
      image: "https://irp-cdn.multiscreensite.com/0a13fae6/dms3rep/multi/desktop/highres-Sony-Alpha-A7-III-2-Custom_1519667443.jpg",
      features: [
        t("featured.equipment.sonyA7III.features.sensor"),
        t("featured.equipment.sonyA7III.features.video"),
        t("featured.equipment.sonyA7III.features.autofocus"),
      ],
      price: t("featured.equipment.sonyA7III.price"),
    },
    {
      name: t("featured.equipment.canonLens.name"),
      image: "https://images.squarespace-cdn.com/content/v1/545012a9e4b0988576f6b699/1624837105281-1SY0VE6ZNO4KQA1KE9GV/canon-rf-24-70mm-f28-review.jpg",
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
        backgroundImage="https://imgs.search.brave.com/o2cW3n4oXJZ6p2OsOZ-MSY2ZQojET6kX6uJthhh6vJ4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA5LzE1LzA3LzU0/LzM2MF9GXzkxNTA3/NTQyNF9MY0g5UHBu/SEU0dVVrYWtyZU5P/TURsaGIzTm9JbDFw/QS5qcGc"
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

