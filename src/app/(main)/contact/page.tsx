import type { Metadata } from "next";

import ContactPageClient from "@/app/(main)/contact/ContactPageClient";
import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import faqsData from "@/content/data/faqs.json";
import {
  buildPageMetadata,
  combineSchemas,
  createBreadcrumbSchema,
  createFAQPageSchema,
  pageKeywords,
} from "@/lib/seo";
import type { FaqData } from "@/lib/types";

const faqs = faqsData as FaqData;

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

const relatedLinks = [
  {
    href: "/hire",
    label: "Hire MS DevX",
    description: "View packages and start a project.",
  },
  {
    href: "/services",
    label: "Services",
    description: "AI development, SaaS, and automation.",
  },
  {
    href: "/tools",
    label: "Tools Hub",
    description: "Free utilities built by MS DevX.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Contact MS DevX",
    description:
      "Get in touch with MS DevX for AI product development, SaaS builds, partnerships, tool feedback, and support.",
    path: "/contact",
    keywords: [...pageKeywords.contact],
  });
}

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={combineSchemas(
          createBreadcrumbSchema(breadcrumbs),
          createFAQPageSchema(faqs.contact)
        )}
      />
      <div className="container pt-20">
        <PageBreadcrumbs items={breadcrumbs} />
      </div>
      <ContactPageClient faqs={faqs.contact} />
      <div className="container pb-20">
        <RelatedLinks links={relatedLinks} />
      </div>
    </>
  );
}
