import type { Metadata } from "next";
import Link from "next/link";
import {
  Brain,
  Globe,
  Rocket,
  Target,
  type LucideIcon,
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
import { siteConfig } from "@/lib/constants";
import {
  buildPageMetadata,
  combineSchemas,
  createAboutPageSchema,
  createBreadcrumbSchema,
  pageKeywords,
} from "@/lib/seo";
import type { AboutTimelineItem, AboutValue } from "@/lib/types";

const timelineItems: AboutTimelineItem[] = [
  {
    title: "Started learning programming",
    description:
      "Built a foundation in software development through self-directed learning, side projects, and solving real problems with code.",
  },
  {
    title: "Entered Data Science",
    description:
      "Expanded into data analysis, machine learning, and statistical modeling — bridging engineering with intelligent decision-making.",
  },
  {
    title: "Began building AI tools",
    description:
      "Started shipping practical AI-powered utilities focused on productivity, automation, and everyday developer workflows.",
  },
  {
    title: "Launched Marth Systems",
    description:
      "Established Marth Systems as the product arm behind tools.marth.systems — a growing suite of free and premium digital tools.",
  },
  {
    title: "Founded MS DevX",
    description:
      "Formed MS DevX as an indie AI studio dedicated to building useful software, SaaS products, and developer-first solutions at speed.",
  },
];

const values: (AboutValue & { icon: LucideIcon })[] = [
  {
    icon: Rocket,
    title: "Speed over bureaucracy",
    description:
      "We move fast with focused execution. Small teams win by shipping, learning, and iterating — not by waiting for perfect plans.",
  },
  {
    icon: Brain,
    title: "AI-first development",
    description:
      "AI is embedded in how we design, build, and automate. We leverage modern models and tooling to deliver smarter products faster.",
  },
  {
    icon: Globe,
    title: "Build in public",
    description:
      "We share progress openly — through blog posts, tool launches, and transparent engineering decisions that help others learn alongside us.",
  },
  {
    icon: Target,
    title: "Long-term thinking",
    description:
      "Speed does not mean shortcuts. We architect for maintainability, brand consistency, and products that compound in value over time.",
  },
];

const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Python",
  "OpenAI",
  "Vercel",
  "PostgreSQL",
] as const;

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

const relatedLinks = [
  {
    href: "/services",
    label: "Services",
    description: "What we build for clients and partners.",
  },
  {
    href: "/blog",
    label: "Blog",
    description: "Our build-in-public journey.",
  },
  {
    href: "/tools",
    label: "Tools",
    description: "Free utilities from MS DevX.",
  },
  {
    href: "/hire",
    label: "Hire Us",
    description: "Work with our studio.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "About MS DevX — Indie AI Studio",
    description:
      "Learn the story, mission, values, and technology behind MS DevX — an indie studio building AI tools, SaaS apps, and developer-first solutions.",
    path: "/about",
    keywords: [...pageKeywords.about],
  });
}

export default function AboutPage() {
  return (
    <main className="py-20">
      <JsonLd
        data={combineSchemas(
          createAboutPageSchema(),
          createBreadcrumbSchema(breadcrumbs)
        )}
      />

      <div className="container">
        <PageBreadcrumbs items={breadcrumbs} />

        <SectionHeader
          title="Building useful software, not just shipping code."
          subtitle={`${siteConfig.name} is an indie AI studio focused on practical tools, SaaS products, and developer-first solutions that solve real problems.`}
        />

        <section className="mx-auto mb-20 max-w-3xl text-center">
          <p className="text-lg font-medium text-electric">{siteConfig.tagline}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description} We believe the best software is built by
            small, focused teams who understand their users deeply — not by
            bloated processes or endless feature lists. Every product we ship
            starts with a clear problem, a tight scope, and a commitment to
            quality execution.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Our mission is to democratize access to powerful AI-driven tools
            and help founders, developers, and businesses ship faster without
            sacrificing craft. From free utilities at{" "}
            <Link
              href="/tools"
              className="text-electric underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
            >
              MS DevX Tools
            </Link>{" "}
            to full SaaS builds, we build software people actually want to use.
            Read our latest thinking on the{" "}
            <Link
              href="/blog"
              className="text-electric underline-offset-4 hover:underline"
            >
              blog
            </Link>
            .
          </p>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="Our Journey"
            subtitle="From first lines of code to an indie AI studio shipping products globally."
          />

          <div className="relative mx-auto max-w-2xl">
            {timelineItems.map((item, index) => (
              <div key={item.title} className="relative flex gap-6 pb-10">
                {index < timelineItems.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute top-6 left-[11px] h-full w-px bg-border/10"
                  />
                )}

                <div
                  aria-hidden="true"
                  className="relative z-10 mt-1 size-6 shrink-0 rounded-full border-2 border-electric bg-background"
                />

                <div className="pt-0.5">
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="What We Stand For"
            subtitle="The principles that guide every product, partnership, and line of code we write."
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <Card
                  key={value.title}
                  className="border-border bg-background py-6"
                >
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-electric/10">
                      <Icon className="size-5 text-electric" />
                    </div>
                    <CardTitle className="text-lg text-foreground">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="Tech Stack"
            subtitle="Modern, battle-tested technologies we use to build fast, reliable, and scalable products."
          />

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="px-4 py-2 text-sm text-foreground"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-electric/5 px-6 py-12 text-center sm:px-10">
          <h2 className="text-2xl font-bold text-foreground">
            Let&apos;s build something useful.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Whether you need a custom AI tool, a SaaS MVP, or help scaling an
            existing product — we&apos;d love to hear about your project.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 bg-electric text-white hover:bg-electric/90"
          >
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </section>

        <RelatedLinks links={relatedLinks} />
      </div>
    </main>
  );
}
