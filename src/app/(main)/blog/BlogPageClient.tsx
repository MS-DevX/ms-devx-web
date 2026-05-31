"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import CategoryFilter from "@/components/tools/CategoryFilter";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import type { BlogCardProps, BlogPageClientProps } from "@/lib/types";

function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="rounded-xl border border-white/10 bg-background p-5 transition hover:shadow-lg">
      <Link href={`/blog/${post.slug}`}>
        <h2 className="text-lg font-semibold text-navy transition hover:text-electric dark:text-white">
          {post.title}
        </h2>
      </Link>

      <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>

      <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
        <time dateTime={post.date}>{post.date}</time>
        <span aria-hidden="true">•</span>
        <span>{post.readingTime} min read</span>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tags">
        {post.tags.map((tag) => (
          <li key={tag}>
            <Badge variant="outline">{tag}</Badge>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("All");

  const debouncedSearch = useDebounce(search, 300);

  const tagFilters = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((item) => tags.add(item));
    });
    return ["All", ...Array.from(tags).sort()];
  }, [posts]);

  const filtered = useMemo(() => {
    const query = debouncedSearch.toLowerCase();

    return posts
      .filter((post) => {
        const matchesSearch =
          query.length === 0 ||
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query);

        const matchesTag = tag === "All" || post.tags.includes(tag);

        return matchesSearch && matchesTag;
      })
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [posts, debouncedSearch, tag]);

  return (
    <main className="py-20">
      <div className="container">
        <SectionHeader
          title="Blog"
          subtitle="Insights, engineering notes, and build-in-public updates from MS DevX."
        />

        <div className="mb-6">
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <Input
            id="blog-search"
            type="search"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mb-10">
          <CategoryFilter
            categories={tagFilters}
            active={tag}
            onChange={setTag}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground" role="status">
            No articles match your search.
          </p>
        )}
      </div>
    </main>
  );
}
