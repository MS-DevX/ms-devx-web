"use client";

import Link from "next/link";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { AppIcon } from "@/components/shared/AppIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apps from "@/content/data/apps.json";
import { getAppBadge, getAppButtons } from "@/lib/app-utils";
import { cn } from "@/lib/utils";

export interface FeaturedAppsProps {
  className?: string;
}

function AppCard({ app }: { app: (typeof apps)[number] }) {
  const badge = getAppBadge(app);
  const buttons = getAppButtons(app);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AppIcon src={app.iconUrl} alt={app.name} size={44} />
          <div>
            <h3 className="text-xl font-bold text-foreground">{app.name}</h3>
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
            variant="outline"
            asChild={!buttons.playStoreDisabled}
            disabled={buttons.playStoreDisabled}
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
            aria-label="Browse all apps in MS DevX directory"
            className="text-base font-semibold text-blue dark:text-electric hover:text-purple dark:hover:text-purple-300 transition-colors"
          >
            Browse all apps →
          </Link>
        </div>
      </div>
    </section>
  );
}
