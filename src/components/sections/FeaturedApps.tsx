"use client";

import Link from "next/link";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apps from "@/content/data/apps.json";
import { cn } from "@/lib/utils";

export interface FeaturedAppsProps {
  className?: string;
}

function AppCard({ app }: { app: (typeof apps)[number] }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">{app.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{app.description}</p>
        </div>

        <Badge className="shrink-0" variant="outline">
          {app.badge}
        </Badge>
      </div>

      <p className="mt-3 text-xs text-electric">{app.category}</p>

      <div className="mt-5 flex gap-2">
        {app.playStoreUrl && (
          <Link
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm">Play Store</Button>
          </Link>
        )}

        {app.webUrl && (
          <Link
            href={app.webUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              variant="outline"
              className="border-electric text-electric hover:bg-electric hover:text-white"
            >
              Web
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function FeaturedApps({ className }: FeaturedAppsProps) {
  const featuredApps = apps.filter((app) => app.featured);

  return (
    <section className={cn("py-20", className)}>
      <div className="container">
        <SectionHeader
          title="Featured Apps"
          subtitle="A collection of high-impact tools and applications built by MS DevX."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/apps"
            className="text-sm font-medium text-electric hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
          >
            Browse all apps →
          </Link>
        </div>
      </div>
    </section>
  );
}
