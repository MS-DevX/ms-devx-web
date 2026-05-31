"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import CategoryFilter from "@/components/tools/CategoryFilter";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        subtitle="AI-powered utilities for developers, students, and creators"
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTools.map((tool) => (
          <Card
            key={tool.id}
            className="flex flex-col border-border bg-background py-5 transition duration-200 hover:-translate-y-1 hover:border-electric/40 hover:shadow-lg"
          >
            <CardHeader>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline">{tool.category}</Badge>
                <Badge
                  variant="outline"
                  className={getStatusBadgeClass(tool.status)}
                >
                  {tool.status === "live" ? "Live" : "Coming Soon"}
                </Badge>
              </div>
              <CardTitle className="text-lg text-foreground">
                {tool.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1">
              <CardDescription className="text-sm leading-relaxed">
                {tool.description}
              </CardDescription>
            </CardContent>

            <CardFooter>
              {tool.status === "live" ? (
                <Button
                  asChild
                  className="w-full bg-electric text-white hover:bg-electric/90"
                >
                  <Link href={`/tools/${tool.slug}`}>Open Tool</Link>
                </Button>
              ) : (
                <Button disabled variant="outline" className="w-full">
                  Coming Soon
                </Button>
              )}
            </CardFooter>
          </Card>
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
