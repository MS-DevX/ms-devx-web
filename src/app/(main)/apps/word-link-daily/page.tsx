import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  CloudOff,
  Flame,
  Grid3x3,
  Lightbulb,
  Lock,
  Map,
  ShieldCheck,
  Target,
  Timer,
  Trophy,
} from "lucide-react";

import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import apps from "@/content/data/apps.json";
import { siteConfig } from "@/lib/constants";
import {
  buildPageMetadata,
  combineSchemas,
  createBreadcrumbSchema,
  pageKeywords,
} from "@/lib/seo";

const APP_SLUG = "word-link-daily";

/**
 * Single source of truth for Play Store availability. Add the listing URL to
 * `apps.json` and both CTAs below switch to a live download button.
 */
const playStoreUrl =
  apps.find((app) => app.landingPage === `/apps/${APP_SLUG}`)?.playStoreUrl ??
  null;

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Apps", path: "/apps" },
  { name: "Word Link Daily", path: `/apps/${APP_SLUG}` },
];

const relatedLinks = [
  {
    href: "/apps",
    label: "All Apps",
    description: "Browse every application built by MS DevX.",
  },
  {
    href: "/wld-privacy",
    label: "Privacy Policy",
    description: "No accounts, no sign-in, no personal data collected.",
  },
  {
    href: "/apps/unit-converter",
    label: "Unit Converter",
    description: "Fast offline unit converter with 300+ units.",
  },
];

const features = [
  {
    icon: CalendarDays,
    title: "A fresh puzzle every day",
    description:
      "A new word-link board drops at midnight UTC. One puzzle a day keeps it fresh and gives you a reason to come back tomorrow.",
  },
  {
    icon: Target,
    title: "Trace in any direction",
    description:
      "Drag across a letter grid to link words in any of the 8 straight directions — horizontal, vertical, or diagonal. No bends, no skips.",
  },
  {
    icon: CloudOff,
    title: "Plays fully offline",
    description:
      "Download the day's puzzle once and play anywhere — on a plane, on a commute, with no signal. Progress syncs to your device cache.",
  },
  {
    icon: Flame,
    title: "Build your streak",
    description:
      "Finish each day's puzzle to keep your streak alive, and track your current and longest run in one tap.",
  },
  {
    icon: Lightbulb,
    title: "Hints when you're stuck",
    description:
      "Every puzzle includes free hints to reveal a starting letter or direction. Use them only when you want to — never forced.",
  },
  {
    icon: Map,
    title: "Stage mode",
    description:
      "Prefer to play at your own pace? Work through a stage campaign that unlocks as you clear each board.",
  },
];

const stats = [
  { value: "5", label: "Words Per Puzzle" },
  { value: "8", label: "Directions" },
  { value: "25", label: "Points Max Per Puzzle" },
  { value: "0", label: "Accounts Required" },
];

const howToPlay = [
  {
    step: "01",
    title: "Open today's puzzle",
    description:
      "The day's board is fetched automatically. After that first sync it is available offline.",
  },
  {
    step: "02",
    title: "Trace the hidden words",
    description:
      "Drag your finger across consecutive letters in a single straight line to link a word.",
  },
  {
    step: "03",
    title: "Clear the board",
    description:
      "Find all 5 hidden words. Each correct word scores 5 points, for 25 points maximum.",
  },
  {
    step: "04",
    title: "Return tomorrow",
    description:
      "Your streak, times, and word totals are saved on-device. No sign-in, nothing to sync.",
  },
];

const highlights = [
  "No account, no sign-in, no profile",
  "No name, email, or phone number collected",
  "Progress, stats, and settings stay on your device",
  "Anonymous, coarse usage events only — never the words you play",
  "No ads in the current release",
  "No personal data ever leaves your phone",
];

const privacyHighlights = [
  "Puzzle progress, statistics, and settings are stored locally on your device only.",
  "Daily puzzle content is downloaded through a public, read-only connection that carries no personal information.",
  "Usage analytics are anonymous and coarse — puzzle started or completed, hint used, sync result. They never contain puzzle answers or anything you type.",
  "There are no accounts, so there is no account data to collect, store, or delete.",
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Word Link Daily — Free Daily Word Puzzle Game | MS DevX",
    absoluteTitle: true,
    description:
      "Word Link Daily is a free daily word puzzle game. Trace hidden words across a letter grid in any of 8 directions. Plays offline, tracks streaks and stats, and needs no account.",
    path: `/apps/${APP_SLUG}`,
    keywords: [
      "word link daily",
      "word puzzle game",
      "daily word puzzle",
      "word search game",
      "word trace game",
      "offline word game",
      "brain teaser game",
      ...pageKeywords.apps,
    ],
  });
}

export default function WordLinkDailyPage() {
  return (
    <main className="py-20">
      <JsonLd data={combineSchemas(createBreadcrumbSchema(breadcrumbs))} />

      <div className="container">
        <PageBreadcrumbs items={breadcrumbs} />

        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge className="mb-4 border-0 bg-gradient-primary text-white">
            Free
          </Badge>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            Word Link Daily
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect the letters to uncover every hidden word. A new puzzle every
            day, playable offline, with no account and nothing to sign up for.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {playStoreUrl ? (
              <Button asChild size="lg" variant="gradient">
                <Link href={playStoreUrl} target="_blank" rel="noopener noreferrer">
                  Get on Google Play
                </Link>
              </Button>
            ) : (
              <Button size="lg" variant="gradient" disabled>
                Coming soon to Google Play
              </Button>
            )}

            <Button asChild size="lg" variant="outline">
              <Link href="/wld-privacy">Read the Privacy Policy</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mb-20 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-electric">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <section className="mb-20">
          <SectionHeader
            title="Features"
            subtitle="A focused word game that opens fast, respects your time, and plays wherever you are."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={feature.title}
                  className="border-border bg-background py-6"
                >
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-electric/10">
                      <Icon className="size-5 text-electric" />
                    </div>
                    <CardTitle className="text-lg text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="How to Play"
            subtitle="Four steps. Most puzzles take a couple of minutes."
          />

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howToPlay.map((item) => (
              <Card
                key={item.step}
                className="border-border bg-background py-6"
              >
                <CardHeader>
                  <span className="text-sm font-bold text-electric">
                    {item.step}
                  </span>
                  <CardTitle className="text-base text-foreground">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="Why Word Link Daily?"
            subtitle="Built around a simple promise: open it, solve a puzzle, get on with your day."
          />

          <div className="mx-auto max-w-3xl">
            <ul className="space-y-4">
              {highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-electric" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="Your Data"
            subtitle="A word game has no reason to know who you are. Here is exactly what happens with your data."
          />

          <Card className="border-border bg-background py-6">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-electric/10">
                <Lock className="size-5 text-electric" />
              </div>
              <CardTitle className="text-lg text-foreground">
                Privacy-first by design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {privacyHighlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Grid3x3 className="mt-0.5 size-4 shrink-0 text-electric" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-muted-foreground">
                Read the full{" "}
                <Link
                  href="/wld-privacy"
                  className="text-electric underline-offset-4 hover:underline"
                >
                  Word Link Daily privacy policy
                </Link>{" "}
                for the complete breakdown, or reach us at{" "}
                <Link
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-electric underline-offset-4 hover:underline"
                >
                  {siteConfig.contactEmail}
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="At a Glance"
            subtitle="Everything the game tracks, and everything it deliberately does not."
          />

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            <Card className="border-border bg-background py-6">
              <CardHeader>
                <Trophy className="mb-2 size-5 text-electric" />
                <CardTitle className="text-base text-foreground">
                  Scored simply
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  5 points for every correct word — no length bonuses, no
                  multipliers. 25 points is a perfect board.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border bg-background py-6">
              <CardHeader>
                <Timer className="mb-2 size-5 text-electric" />
                <CardTitle className="text-base text-foreground">
                  Completion times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  See how long each puzzle took, plus your average and total
                  time across every run.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border bg-background py-6">
              <CardHeader>
                <Grid3x3 className="mb-2 size-5 text-electric" />
                <CardTitle className="text-base text-foreground">
                  Adaptive boards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Grids scale from compact 4×4 boards up to 10×10, so each
                  puzzle fits its difficulty.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-electric/5 px-6 py-12 text-center sm:px-10">
          <h2 className="text-2xl font-bold text-foreground">
            Ready for today&apos;s puzzle?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Word Link Daily is free, needs no account, and works offline once
            the day&apos;s board is on your device.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {playStoreUrl ? (
              <Button asChild size="lg" variant="gradient">
                <Link
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get on Google Play
                </Link>
              </Button>
            ) : (
              <Button size="lg" variant="gradient" disabled>
                Coming soon to Google Play
              </Button>
            )}

            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </section>

        <RelatedLinks links={relatedLinks} />
      </div>
    </main>
  );
}