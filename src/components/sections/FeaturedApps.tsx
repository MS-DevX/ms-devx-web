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
    <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">{app.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{app.description}</p>
        </div>

        <Badge className="shrink-0 bg-gradient-primary text-white border-0">
          {app.badge}
        </Badge>
      </div>

      <p className="mt-4 text-sm text-blue font-semibold">{app.category}</p>

      <div className="mt-6 flex gap-3">
        {app.landingPage && (
          <Link href={app.landingPage}>
            <Button size="sm" variant="gradient">Learn More</Button>
          </Link>
        )}

        {app.playStoreUrl && (
          <Link
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" variant="outline">
              Play Store
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
    <section className={cn("py-24", className)}>
      <div className="container">
        <SectionHeader
          title="Featured Apps"
          subtitle="A collection of AI-powered tools and applications built by MS DevX."
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {featuredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/apps"
            className="text-base font-semibold text-blue hover:text-purple transition-colors"
          >
            Browse all apps →
          </Link>
        </div>
      </div>
    </section>
  );
}
