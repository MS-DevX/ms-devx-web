import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import BlogTeaser from "@/components/sections/BlogTeaser";
import FeaturedApps from "@/components/sections/FeaturedApps";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import StatsBar from "@/components/sections/StatsBar";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { siteConfig } from "@/lib/constants";
import {
  buildPageMetadata,
  combineSchemas,
  createOrganizationSchema,
  createWebSiteSchema,
  pageKeywords,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    path: "/",
    keywords: [...pageKeywords.home],
    absoluteTitle: true,
  });
}

export default function HomePage() {
  return (
    <main>
      <JsonLd
        data={combineSchemas(
          createOrganizationSchema(),
          createWebSiteSchema()
        )}
      />

      <HeroSection />
      <StatsBar />
      <ServicesSection />
      <FeaturedApps />
      <TestimonialsSection />
      <BlogTeaser />
    </main>
  );
}
