"use client";

import Link from "next/link";
import { useState } from "react";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apps from "@/content/data/apps.json";
import { appCategories } from "@/lib/constants";

function AppCard({ app }: { app: (typeof apps)[number] }) {
  const isComingSoon = app.status === "coming-soon";
  const hasLandingPage = Boolean(app.landingPage);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="text-xl font-bold text-foreground">{app.name}</h3>
        {isComingSoon && app.closedTesting && (
          <Badge variant="outline" className="border-border bg-muted/50 text-muted-foreground">
            Closed Testing
          </Badge>
        )}
        {isComingSoon && !app.closedTesting && (
          <Badge variant="outline" className="border-border bg-muted/50 text-muted-foreground">
            Coming Soon
          </Badge>
        )}
        {!isComingSoon && (
          <Badge className="shrink-0 bg-gradient-primary text-white border-0">
            {app.badge}
          </Badge>
        )}
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{app.description}</p>

      <p className="mt-4 text-sm text-blue font-semibold">{app.category}</p>

      <div className="mt-6 flex gap-3">
        {hasLandingPage && (
          <Button size="sm" asChild>
            <Link href={app.landingPage!}>
              {isComingSoon ? "Learn More" : "Learn More"}
            </Link>
          </Button>
        )}

        {!hasLandingPage && app.playStoreUrl && (
          <Button
            size="sm"
            asChild={!isComingSoon}
            disabled={isComingSoon}
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

        {!hasLandingPage && app.webUrl && (
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
