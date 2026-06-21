"use client";

import Link from "next/link";
import { useState } from "react";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apps from "@/content/data/apps.json";
import { appCategories } from "@/lib/constants";
import type { ToolStatus } from "@/lib/types";

function AppCard({ app }: { app: (typeof apps)[number] }) {
  const isComingSoon = app.status === "coming-soon";

  return (
    <div className="rounded-xl border border-border bg-background p-5 transition hover:shadow-lg">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="font-semibold text-foreground">{app.name}</h3>
        {isComingSoon && (
          <Badge variant="outline" className="border-border bg-muted/50 text-muted-foreground">
            Coming Soon
          </Badge>
        )}
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{app.description}</p>

      <p className="mt-2 text-xs text-electric">{app.category}</p>

      <div className="mt-4 flex gap-2">
        {app.playStoreUrl && (
          <Button
            size="sm"
            asChild={!isComingSoon}
            disabled={isComingSoon}
            variant={isComingSoon ? "outline" : "default"}
          >
            {isComingSoon ? (
              "Play Store"
            ) : (
              <Link href={app.playStoreUrl} target="_blank" rel="noopener noreferrer">
                Play Store
              </Link>
            )}
          </Button>
        )}

        {app.webUrl && (
          <Button
            size="sm"
            variant="outline"
            asChild={!isComingSoon}
            disabled={isComingSoon}
          >
            {isComingSoon ? (
              "Web"
            ) : (
              <Link href={app.webUrl} target="_blank" rel="noopener noreferrer">
                Web
              </Link>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AppsPageClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredApps =
    activeCategory === "All"
      ? apps
      : apps.filter((app) => app.category === activeCategory);

  return (
    <main className="pb-20">
      <div className="container">
        <SectionHeader
          title="All Apps"
          subtitle="Browse every application and product built under MS DevX ecosystem."
        />

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {appCategories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className="text-sm"
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </main>
  );
}
