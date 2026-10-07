import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Hash,
  MapPin,
  Moon,
  Star,
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
import {
  buildPageMetadata,
  combineSchemas,
  createBreadcrumbSchema,
  pageKeywords,
} from "@/lib/seo";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Apps", path: "/apps" },
  { name: "Muslim Companion", path: "/apps/muslim-companion" },
];

const relatedLinks = [
  {
    href: "/apps",
    label: "All Apps",
    description: "Browse every application built by MS DevX.",
  },
  {
    href: "/muslim-companion/privacy",
    label: "Privacy Policy",
    description: "Muslim Companion is privacy-first and fully offline.",
  },
  {
    href: "/apps/unit-converter",
    label: "Unit Converter",
    description: "Fast offline unit converter app.",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Quran Reader",
    description:
      "Full Quran with 7 translations (English, Urdu, Hindi, Bangla, Turkish, Spanish, Indonesian), verse-by-verse mode, bookmarks, last-read tracking, and audio playback support.",
  },
  {
    icon: Moon,
    title: "Prayer Times",
    description:
      "Accurate prayer times with multiple calculation methods (MWL, ISNA, Egypt, Makkah, Karachi, Tehran, Jafari). Custom notification scheduling with Android alarm integration.",
  },
  {
    icon: Compass,
    title: "Qibla Compass",
    description:
      "Real-time Qibla direction using device compass and GPS. Manual coordinate fallback when GPS is unavailable.",
  },
  {
    icon: Star,
    title: "Hadith Explorer",
    description:
      "Browse hadiths from Al-Bukhari and Muslim collections. Search by keyword, filter by book, and bookmark your favorites.",
  },
  {
    icon: Hash,
    title: "Tasbeeh Counter",
    description:
      "Digital dhikr counter with 7 preset phrases, custom dhikr support, vibration feedback, session tracking, and daily recitation history.",
  },
  {
    icon: MapPin,
    title: "Hifz Tracker",
    description:
      "Track your Quran memorization progress with per-Surah status (Not Started, In Progress, Memorized). Local backup and restore support.",
  },
];

const techHighlights = [
  "100% Offline — no data ever leaves your device",
  "Zero servers — all calculations run on-device",
  "Privacy-first — no analytics, no tracking, no accounts",
  "Built with Flutter for smooth, native performance",
  "Local backup & restore via clipboard",
  "Ad-free by default (optional App Open Ad)",
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title:
      "Muslim Companion — Offline Quran, Prayer Times & Qibla Compass | MS DevX",
    absoluteTitle: true,
    description:
      "Offline Islamic companion app: Quran reader with 7 translations, accurate prayer times, Qibla compass, Hadith explorer, Tasbeeh counter, and Hifz tracker. Fully offline, privacy-first.",
    path: "/apps/muslim-companion",
    keywords: [
      "muslim companion",
      "quran reader",
      "prayer times",
      "qibla compass",
      "hadith explorer",
      "tasbeeh counter",
      "hifz tracker",
      "offline islamic app",
      ...pageKeywords.apps,
    ],
  });
}

export default function MuslimCompanionPage() {
  return (
    <main className="py-20">
      <JsonLd
        data={combineSchemas(createBreadcrumbSchema(breadcrumbs))}
      />

      <div className="container">
        <PageBreadcrumbs items={breadcrumbs} />

        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge className="mb-4 bg-gradient-primary text-white border-0">
            Free
          </Badge>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            Muslim Companion
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your all-in-one offline Islamic companion — Quran reader, prayer
            times, Qibla compass, Hadith explorer, and Tasbeeh counter. Fully
            offline. Zero data collection.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-electric text-white hover:bg-electric/90"
              asChild
            >
              <Link
                href="https://play.google.com/store/apps/details?id=com.msdevx.muslimcompanion&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get Muslim Companion on Google Play"
              >
                Get on Google Play
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/muslim-companion/privacy">
                Read Privacy Policy
              </Link>
            </Button>
          </div>
        </div>

        <section className="mb-20">
          <SectionHeader
            title="Features"
            subtitle="Everything you need for your daily Islamic practice — running entirely on your device."
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
            title="Why Muslim Companion?"
            subtitle="Built with privacy at its core."
          />

          <div className="mx-auto max-w-3xl">
            <ul className="space-y-4">
              {techHighlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-electric" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="Supported Translations"
            subtitle="Read the Quran in your language."
          />

          <div className="mx-auto max-w-2xl">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { lang: "English", translator: "Sahih International" },
                { lang: "Urdu", translator: "Maududi" },
                { lang: "Hindi", translator: "Maududi" },
                { lang: "Bangla", translator: "Mufti Taqi Usmani" },
                { lang: "Turkish", translator: "Diyanet İşleri" },
                { lang: "Spanish", translator: "Abdul Ghani Llará" },
                { lang: "Indonesian", translator: "Kemenag" },
              ].map((t) => (
                <Card
                  key={t.lang}
                  className="border-border bg-background py-4"
                >
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base text-foreground">
                      {t.lang}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      {t.translator}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-electric/5 px-6 py-12 text-center sm:px-10">
          <h2 className="text-2xl font-bold text-foreground">
            Get Muslim Companion today
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Download it from Google Play — fully offline, privacy-first, and
            free.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-electric text-white hover:bg-electric/90"
              asChild
            >
              <Link
                href="https://play.google.com/store/apps/details?id=com.msdevx.muslimcompanion&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get Muslim Companion on Google Play"
              >
                Get on Google Play
              </Link>
            </Button>
            <Link
              href="/muslim-companion/privacy"
              className="inline-flex items-center px-4 text-sm text-electric underline-offset-4 hover:underline"
            >
              Read our Privacy Policy
            </Link>
          </div>
        </section>

        <RelatedLinks links={relatedLinks} />
      </div>
    </main>
  );
}
