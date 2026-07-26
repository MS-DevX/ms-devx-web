"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import CategoryFilter from "@/components/tools/CategoryFilter";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { toolCategories } from "@/lib/constants";
import type { Tool, ToolsHubPageClientProps } from "@/lib/types";

const filterCategories = ["All", ...toolCategories];

function getStatusBadgeClass(status: Tool["status"]): string {
  if (status === "live") {
    return "border-teal/40 bg-teal/10 text-teal";
  }

  return "border-border bg-muted/50 text-muted-foreground";
}

export default function ToolsHubPageClient({ tools }: ToolsHubPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const filteredTools = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();

    return tools.filter((tool) => {
      const matchesCategory =
        activeCategory === "All" || tool.category === activeCategory;

      const matchesSearch =
        query.length === 0 ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [tools, activeCategory, debouncedSearch]);

  return (
    <>
      <SectionHeader
        title="MS DevX Tools Hub"
        subtitle="75+ free online tools and calculators — all private, all instant"
        className="mb-10"
      />

      <div className="relative mx-auto mb-8 max-w-xl">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="tools-hub-search" className="sr-only">
          Search tools
        </label>
        <Input
          id="tools-hub-search"
          type="search"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="mb-10">
        <CategoryFilter
          categories={filterCategories}
          active={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-foreground">{tool.name}</h3>
              <Badge
                variant="outline"
                className={getStatusBadgeClass(tool.status)}
              >
                {tool.status === "live" ? "Live" : "Coming Soon"}
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>

            <p className="mt-4 text-sm text-blue font-semibold">{tool.category}</p>

            <div className="mt-6">
              {tool.status === "live" ? (
                <Button
                  asChild
                  size="sm"
                  className="btn-primary"
                >
                  <Link href={`/tools/${tool.slug}`}>Open Tool</Link>
                </Button>
              ) : (
                <Button disabled size="sm" variant="outline">
                  Coming Soon
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <p className="text-center text-sm text-muted-foreground" role="status">
          No tools match your search.
        </p>
      )}
    </>
  );
}
