import Link from "next/link";
import { Suspense } from "react";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/mdx";
import { cn, formatDate } from "@/lib/utils";

export interface BlogTeaserProps {
  className?: string;
}

function BlogCard({
  post,
}: {
  post: Awaited<ReturnType<typeof getAllPosts>>[number];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-background p-5 transition hover:shadow-lg">
      <Link href={`/blog/${post.slug}`}>
        <h3 className="text-lg font-semibold text-navy transition hover:text-electric dark:text-white">
          {post.title}
        </h3>
      </Link>

      <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>{formatDate(post.date)}</span>
        <span>•</span>
        <span>{post.readingTime} min read</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function BlogTeaserSkeleton({ className }: BlogTeaserProps) {
  return (
    <section className={cn("py-20", className)}>
      <div className="container">
        <SectionHeader
          title="Latest Insights"
          subtitle="Thoughts, engineering breakdowns, and lessons from building AI tools at MS DevX."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl border border-white/10 bg-background"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

async function BlogTeaserContent({ className }: BlogTeaserProps) {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 3);

  return (
    <section className={cn("py-20", className)}>
      <div className="container">
        <SectionHeader
          title="Latest Insights"
          subtitle="Thoughts, engineering breakdowns, and lessons from building AI tools at MS DevX."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {latestPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="text-sm font-medium text-electric hover:underline"
          >
            View all posts →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function BlogTeaser({ className }: BlogTeaserProps) {
  return (
    <Suspense fallback={<BlogTeaserSkeleton className={className} />}>
      <BlogTeaserContent className={className} />
    </Suspense>
  );
}
