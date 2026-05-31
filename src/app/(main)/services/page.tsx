import type { Metadata } from "next";
import Link from "next/link";

import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import servicesData from "@/content/data/services.json";
import { siteConfig } from "@/lib/constants";
import {
  buildPageMetadata,
  combineSchemas,
  createBreadcrumbSchema,
  createServiceSchemas,
  pageKeywords,
} from "@/lib/seo";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

const services = servicesData as Service[];

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

const relatedLinks = [
  {
    href: "/hire",
    label: "Hire MS DevX",
    description: "Packages for SaaS MVPs, AI products, and consulting.",
  },
  {
    href: "/tools",
    label: "Free Tools",
    description: "AI-powered utilities built by MS DevX.",
  },
  {
    href: "/blog",
    label: "Engineering Blog",
    description: "Build-in-public notes and technical insights.",
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Discuss your project with our team.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "AI & SaaS Development Services",
    description:
      "Explore AI product development, SaaS builds, mobile apps, and automation services by MS DevX — from MVPs to enterprise systems.",
    path: "/services",
    keywords: [...pageKeywords.services],
  });
}

export default function ServicesPage() {
  return (
    <main className="py-20">
      <JsonLd
        data={combineSchemas(
          createBreadcrumbSchema(breadcrumbs),
          ...createServiceSchemas(services)
        )}
      />

      <div className="container">
        <PageBreadcrumbs items={breadcrumbs} />

        <SectionHeader
          title="Our Services"
          subtitle="We design and build AI-powered systems, SaaS products, and automation workflows tailored for scale."
        />

        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-white/10 bg-background p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-navy dark:text-white">
                  {service.title}
                </h2>

                <Badge variant="outline">{siteConfig.name}</Badge>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {service.description}
              </p>

              <div className="mt-6 space-y-4">
                {service.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={cn(
                      "rounded-lg border p-4 transition",
                      tier.highlighted
                        ? "border-electric bg-electric/5"
                        : "border-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-navy dark:text-white">
                        {tier.name}
                      </h3>

                      <span className="font-semibold text-electric">
                        {tier.price}
                      </span>
                    </div>

                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {tier.features.map((feature) => (
                        <li key={feature}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild className="bg-electric text-white hover:bg-electric/90">
            <Link href="/hire">View hiring packages</Link>
          </Button>
        </div>

        <RelatedLinks links={relatedLinks} />
      </div>
    </main>
  );
}
