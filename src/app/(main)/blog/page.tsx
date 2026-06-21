import type { Metadata } from "next";

import BlogPageClient from "@/app/(main)/blog/BlogPageClient";
import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { getAllPosts } from "@/lib/mdx";
import {
  buildPageMetadata,
  combineSchemas,
  createBlogSchema,
  createBreadcrumbSchema,
  pageKeywords,
} from "@/lib/seo";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

const relatedLinks = [
  {
    href: "/tools",
    label: "Tools Hub",
    description: "Try free AI utilities from MS DevX.",
  },
  {
    href: "/services",
    label: "Services",
    description: "How we build AI products and SaaS platforms.",
  },
  {
    href: "/hire",
    label: "Hire Us",
    description: "Work with MS DevX on your next project.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Blog — Engineering & Build in Public",
    description:
      "Insights, engineering notes, Next.js tutorials, and build-in-public updates from the MS DevX indie AI studio.",
    path: "/blog",
    keywords: [...pageKeywords.blog],
  });
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <JsonLd
        data={combineSchemas(
          createBreadcrumbSchema(breadcrumbs),
          createBlogSchema(posts)
        )}
      />
      <div className="container pt-20">
        <PageBreadcrumbs items={breadcrumbs} />
      </div>
      <BlogPageClient posts={posts} />
      <div className="container pb-20">
        <RelatedLinks links={relatedLinks} />
      </div>
    </>
  );
}
