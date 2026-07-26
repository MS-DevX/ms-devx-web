"use client";

import Link from "next/link";
import { useState } from "react";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { AppIcon } from "@/components/shared/AppIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apps from "@/content/data/apps.json";
import { getAppBadge, getAppButtons } from "@/lib/app-utils";
import { appCategories } from "@/lib/constants";

function AppCard({ app }: { app: (typeof apps)[number] }) {
  const badge = getAppBadge(app);
  const buttons = getAppButtons(app);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AppIcon src={app.iconUrl} alt={app.name} size={44} />
          <div>
            <h2 className="text-xl font-bold text-foreground">{app.name}</h2>
          </div>
        </div>

        {badge.variant === "gradient" ? (
          <Badge className="shrink-0 bg-gradient-primary text-white border-0">
            {badge.label}
          </Badge>
        ) : (
          <Badge variant="outline" className="shrink-0 border-border bg-muted/50 text-muted-foreground">
            {badge.label}
          </Badge>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm text-muted-foreground">{app.description}</p>

      <p className="mt-4 text-sm font-semibold text-blue dark:text-electric">{app.category}</p>

      <div className="mt-6 flex gap-3">
        {buttons.showLearnMore && (
          <Button size="sm" asChild variant="gradient">
            <Link href={buttons.landingPage!} aria-label={`Learn more about ${app.name}`}>
              Learn More
            </Link>
          </Button>
        )}

        {buttons.showPlayStore && (
          <Button
            size="sm"
            asChild={!buttons.playStoreDisabled}
            disabled={buttons.playStoreDisabled}
            variant="gradient"
          >
            {buttons.playStoreDisabled ? (
              "Play Store"
            ) : (
              <Link href={buttons.playStoreUrl!} target="_blank" rel="noopener noreferrer" aria-label={`Get ${app.name} on Google Play Store`}>
                Play Store
              </Link>
            )}
          </Button>
        )}

        {buttons.showWeb && (
          <Button
            size="sm"
            variant="outline"
            asChild={!buttons.webDisabled}
            disabled={buttons.webDisabled}
          >
            {buttons.webDisabled ? (
              "Web"
            ) : (
              <Link href={buttons.webUrl!} target="_blank" rel="noopener noreferrer" aria-label={`Open ${app.name} web app`}>
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
          as="h1"
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
