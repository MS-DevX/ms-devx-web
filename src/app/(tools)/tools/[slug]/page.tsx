import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";

import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import ToolLayout from "@/components/tools/ToolLayout";
import ToolRenderer from "@/components/tools/ToolRenderer";

import toolsData from "@/content/data/tools.json";
import { siteConfig } from "@/lib/constants";
import {
  buildPageMetadata,
  combineSchemas,
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
  pageKeywords,
  toolsPublicPath,
} from "@/lib/seo";
import type { Tool, ToolPageProps } from "@/lib/types";

const tools = toolsData as Tool[];

function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {};
  }

  return buildPageMetadata({
    title: `${tool.name} — Free Online Tool`,
    description: tool.description,
    path: toolsPublicPath(slug),
    host: "tools",
    keywords: [
      tool.name,
      tool.category,
      "MS DevX",
      "free online tool",
      ...pageKeywords.tools,
    ],
    absoluteTitle: true,
  });
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Tools", path: "/" },
    { name: tool.name, path: toolsPublicPath(slug) },
  ];

  const relatedTools = tools
    .filter((item) => item.slug !== slug && item.category === tool.category)
    .slice(0, 3)
    .map((item) => ({
      href: toolsPublicPath(item.slug),
      label: item.name,
      description: item.description,
    }));

  const relatedLinks =
    relatedTools.length > 0
      ? relatedTools
      : [
          {
            href: "/",
            label: "All Tools",
            description: "Browse the full MS DevX tools hub.",
          },
          {
            href: siteConfig.url,
            label: "MS DevX Home",
            description: "Services, apps, and blog.",
          },
        ];

  return (
    <>
      <JsonLd
        data={combineSchemas(
          createSoftwareApplicationSchema(tool),
          createBreadcrumbSchema(breadcrumbs, "tools")
        )}
      />
      <PageBreadcrumbs items={breadcrumbs} />
      <ToolLayout
        title={tool.name}
        description={tool.description}
        status={tool.status}
      >
        {tool.status === "live" ? (
          <ToolRenderer slug={slug} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Coming Soon
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              This tool is under development and will be available shortly.
              Check back soon!
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/tools">Browse All Tools</Link>
            </Button>
          </div>
        )}
      </ToolLayout>
      <RelatedLinks
        title="Related tools"
        links={relatedLinks}
        className="mt-8"
      />
    </>
  );
}
