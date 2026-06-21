import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import toolsData from "@/content/data/tools.json";
import { siteConfig } from "@/lib/constants";
import {
  absoluteUrl,
  buildPageMetadata,
  combineSchemas,
  createBreadcrumbSchema,
  createCollectionPageSchema,
  pageKeywords,
  toolsPublicPath,
} from "@/lib/seo";
import type { Tool } from "@/lib/types";

import ToolsHubPageClient from "./ToolsHubPageClient";

const tools = toolsData as Tool[];

const breadcrumbs = [{ name: "Tools Hub", path: "/" }];

const relatedLinks = [
  {
    href: siteConfig.url,
    label: "MS DevX Home",
    description: "AI studio, services, and apps.",
  },
  {
    href: `${siteConfig.url}/blog`,
    label: "Blog",
    description: "Engineering notes and product updates.",
  },
  {
    href: `${siteConfig.url}/services`,
    label: "Services",
    description: "Custom AI and SaaS development.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "MS DevX Tools Hub — Free AI Utilities",
    description:
      "AI-powered utilities for developers, students, and creators — resume builder, PDF toolkit, prayer times, homework helper, and more.",
    path: "/",
    host: "tools",
    keywords: [...pageKeywords.tools],
    absoluteTitle: true,
  });
}

export default function ToolsHubPage() {
  const collectionSchema = createCollectionPageSchema({
    name: "MS DevX Tools Hub",
    description:
      "AI-powered utilities for developers, students, and creators.",
    path: "/",
    host: "tools",
    items: tools.map((tool) => ({
      name: tool.name,
      url: absoluteUrl(toolsPublicPath(tool.slug), "tools"),
    })),
  });

  return (
    <>
      <JsonLd
        data={combineSchemas(
          createBreadcrumbSchema(breadcrumbs, "tools"),
          collectionSchema
        )}
      />
      <PageBreadcrumbs items={breadcrumbs} />
      <ToolsHubPageClient tools={tools} />
      <RelatedLinks links={relatedLinks} className="mt-12" />
    </>
  );
}
