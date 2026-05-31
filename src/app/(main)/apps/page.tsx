import type { Metadata } from "next";

import AppsPageClient from "@/app/(main)/apps/AppsPageClient";
import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import {
  buildPageMetadata,
  combineSchemas,
  createBreadcrumbSchema,
  pageKeywords,
} from "@/lib/seo";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Apps", path: "/apps" },
];

const relatedLinks = [
  {
    href: "/tools",
    label: "MS DevX Tools",
    description: "Free web utilities for developers and creators.",
  },
  {
    href: "/services",
    label: "Services",
    description: "Custom AI and SaaS development offerings.",
  },
  {
    href: "/blog",
    label: "Blog",
    description: "Product updates and engineering articles.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Apps & Digital Products",
    description:
      "Explore AI apps, productivity tools, Islamic apps, and digital products built by MS DevX for Android and the web.",
    path: "/apps",
    keywords: [...pageKeywords.apps],
  });
}

export default function AppsPage() {
  return (
    <>
      <JsonLd data={combineSchemas(createBreadcrumbSchema(breadcrumbs))} />
      <div className="container pt-20">
        <PageBreadcrumbs items={breadcrumbs} />
      </div>
      <AppsPageClient />
      <div className="container pb-20">
        <RelatedLinks links={relatedLinks} />
      </div>
    </>
  );
}
