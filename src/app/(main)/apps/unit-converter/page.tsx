import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightLeft,
  Banknote,
  Calculator,
  Globe,
  Ruler,
  Thermometer,
  Weight,
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
  { name: "Unit Converter", path: "/apps/unit-converter" },
];

const relatedLinks = [
  {
    href: "/apps",
    label: "All Apps",
    description: "Browse every application built by MS DevX.",
  },
  {
    href: "/tools",
    label: "Tools Hub",
    description: "Free web utilities for developers and creators.",
  },
  {
    href: "/apps/muslim-companion",
    label: "Muslim Companion",
    description: "Offline Islamic companion app.",
  },
];

const features = [
  {
    icon: Ruler,
    title: "Length & Distance",
    description:
      "Convert meters, kilometers, miles, feet, inches, yards, nautical miles, and more.",
  },
  {
    icon: Weight,
    title: "Weight & Mass",
    description:
      "Switch between kilograms, grams, pounds, ounces, stones, and tonnes instantly.",
  },
  {
    icon: Thermometer,
    title: "Temperature",
    description:
      "Celsius, Fahrenheit, and Kelvin conversions with real-time results.",
  },
  {
    icon: ArrowRightLeft,
    title: "Speed & Velocity",
    description:
      "km/h, mph, m/s, knots, and Mach — useful for travel and physics.",
  },
  {
    icon: Calculator,
    title: "Area & Volume",
    description:
      "Square meters to acres, liters to gallons, and dozens more.",
  },
  {
    icon: Banknote,
    title: "Currency Conversion",
    description:
      "170+ currencies with live exchange rates. Works offline with cached rates.",
  },
  {
    icon: Globe,
    title: "Data & Digital",
    description:
      "Bytes, kilobytes, megabytes, gigabytes, terabytes, bits, and more.",
  },
];

const categories = [
  "Length",
  "Weight",
  "Temperature",
  "Area",
  "Volume",
  "Speed",
  "Data",
  "Time",
  "Currency",
  "Pressure",
  "Energy",
  "Power",
  "Frequency",
  "Angle",
  "Fuel Consumption",
  "Typography",
];

const stats = [
  { value: "53", label: "Unit Categories" },
  { value: "300+", label: "Units Supported" },
  { value: "170+", label: "Currencies" },
  { value: "100%", label: "Offline" },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Unit Converter — Fast Offline Unit Converter App | MS DevX",
    absoluteTitle: true,
    description:
      "Convert length, weight, temperature, speed, data, and 170+ currencies instantly. 300+ units across 53 categories — fully offline, no internet required.",
    path: "/apps/unit-converter",
    keywords: [
      "unit converter",
      "offline converter",
      "currency converter",
      "measurement converter",
      "metric imperial converter",
      ...pageKeywords.apps,
    ],
  });
}

export default function UnitConverterPage() {
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
            Unit Converter
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Convert length, weight, temperature, speed, data, and 170+
            currencies instantly — no internet required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-electric text-white hover:bg-electric/90"
            >
              <Link
                href="https://play.google.com/store/apps/details?id=com.msdevx.unitconverter&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get on Google Play
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mb-20 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-electric">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <section className="mb-20">
          <SectionHeader
            title="Features"
            subtitle="Everything you need for quick, accurate unit conversions — all running offline on your device."
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
            title="Supported Categories"
            subtitle="53 categories covering every measurement system you'll ever need."
          />

          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="px-4 py-2 text-sm text-foreground"
                >
                  {cat}
                </Badge>
              ))}
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm text-muted-foreground"
              >
                + 37 more
              </Badge>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="Why Unit Converter?"
            subtitle="Built for speed and simplicity."
          />

          <div className="mx-auto max-w-3xl space-y-6">
            <Card className="border-border bg-background py-6">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Fully Offline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  No internet connection needed. Convert units anywhere — on a
                  plane, in a remote area, or wherever you are. All conversion
                  logic runs entirely on your device.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border bg-background py-6">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Blazing Fast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Results appear instantly as you type. No loading spinners, no
                  delays — just immediate, accurate conversions every time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border bg-background py-6">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Clean & Simple
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  No clutter, no ads (free version), no sign-up required. Open
                  the app and start converting. That&apos;s it.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-electric/5 px-6 py-12 text-center sm:px-10">
          <h2 className="text-2xl font-bold text-foreground">
            Ready to convert?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Download Unit Converter for free on Google Play and start
            converting units instantly.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 bg-electric text-white hover:bg-electric/90"
          >
            <Link
              href="https://play.google.com/store/apps/details?id=com.msdevx.unitconverter&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get on Google Play
            </Link>
          </Button>
        </section>

        <RelatedLinks links={relatedLinks} />
      </div>
    </main>
  );
}
