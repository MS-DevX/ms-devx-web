import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import {
  buildPageMetadata,
  combineSchemas,
  createBlogPostingSchema,
  createBreadcrumbSchema,
} from "@/lib/seo";
import type { BlogPostPageProps } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    keywords: [...post.tags, "MS DevX", "blog"],
    ogType: "article",
    publishedTime: post.date,
    authors: [post.author],
    images: post.coverImage ? [post.coverImage] : undefined,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.content) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${slug}` },
  ];

  const relatedLinks = [
    {
      href: "/services",
      label: "Our Services",
      description: "AI product development and SaaS builds.",
    },
    {
      href: "/tools",
      label: "Free Tools",
      description: "Utilities from the MS DevX tools hub.",
    },
    {
      href: "/hire",
      label: "Hire MS DevX",
      description: "Start a project with our studio.",
    },
  ];

  return (
    <main className="py-20">
      <JsonLd
        data={combineSchemas(
          createBlogPostingSchema(post),
          createBreadcrumbSchema(breadcrumbs)
        )}
      />

      <article className="container max-w-3xl">
        <PageBreadcrumbs items={breadcrumbs} />

        <header className="mb-10">
          <h1 className="text-4xl font-bold text-foreground">
            {post.title}
          </h1>

          <p className="mt-4 text-muted-foreground">{post.description}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">•</span>
            <span>{post.readingTime} min read</span>
            <span aria-hidden="true">•</span>
            <span>{post.author}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-electric">
                {tag}
              </Badge>
            ))}
          </div>

          {post.coverImage && (
            <div className="mt-8 overflow-hidden rounded-xl border border-border">
              <Image
                src={post.coverImage}
                alt={`Cover image for ${post.title}`}
                width={896}
                height={504}
                className="w-full object-cover"
                priority
              />
            </div>
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote source={post.content} />
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {previousPost ? (
            <Link
              href={`/blog/${previousPost.slug}`}
              className="rounded-xl border border-border p-4 transition hover:border-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
            >
              <p className="text-xs text-muted-foreground">Previous</p>
              <p className="mt-1 font-medium">{previousPost.title}</p>
            </Link>
          ) : (
            <div />
          )}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="rounded-xl border border-border p-4 text-right transition hover:border-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
            >
              <p className="text-xs text-muted-foreground">Next</p>
              <p className="mt-1 font-medium">{nextPost.title}</p>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <RelatedLinks
          title="Continue exploring"
          links={relatedLinks}
        />
      </article>
    </main>
  );
}
