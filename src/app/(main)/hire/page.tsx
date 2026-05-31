import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import faqsData from "@/content/data/faqs.json";
import {
  buildPageMetadata,
  combineSchemas,
  createBreadcrumbSchema,
  createFAQPageSchema,
  createProfessionalServiceSchema,
  pageKeywords,
} from "@/lib/seo";
import type {
  FaqData,
  FreelancePlatform,
  HirePackage,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const faqs = faqsData as FaqData;

const packages: HirePackage[] = [
  {
    id: "starter",
    name: "Starter",
    price: "From $499",
    features: ["Landing page", "Basic automation", "Email support"],
    highlighted: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "From $2,999",
    features: [
      "Full SaaS MVP",
      "Admin dashboard",
      "Database setup",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom pricing",
    features: [
      "Custom architecture",
      "AI integrations",
      "Multi-user systems",
      "Dedicated consulting",
    ],
    highlighted: false,
  },
];

const freelancePlatforms: FreelancePlatform[] = [
  {
    name: "Fiverr",
    description:
      "Browse fixed-price gigs for landing pages, automations, and quick-turnaround AI tools.",
    url: "https://www.fiverr.com/",
  },
  {
    name: "Upwork",
    description:
      "Hire MS DevX for longer engagements, SaaS builds, and ongoing development contracts.",
    url: "https://www.upwork.com/",
  },
];

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Hire", path: "/hire" },
];

const relatedLinks = [
  {
    href: "/services",
    label: "Services",
    description: "Full list of development offerings.",
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Start a conversation about your project.",
  },
  {
    href: "/tools",
    label: "Tools",
    description: "See the quality of our free utilities.",
  },
  {
    href: "/blog",
    label: "Blog",
    description: "How we build and ship products.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Hire MS DevX — AI & SaaS Development",
    description:
      "Hire MS DevX for AI products, SaaS MVPs, automation systems, mobile apps, and technical consulting. Transparent packages from starter to enterprise.",
    path: "/hire",
    keywords: [...pageKeywords.hire],
    absoluteTitle: true,
  });
}

export default function HirePage() {
  return (
    <main className="py-20">
      <JsonLd
        data={combineSchemas(
          createProfessionalServiceSchema(),
          createFAQPageSchema(faqs.hire),
          createBreadcrumbSchema(breadcrumbs)
        )}
      />

      <div className="container">
        <PageBreadcrumbs items={breadcrumbs} />

        <SectionHeader
          title="Hire MS DevX"
          subtitle="AI products, SaaS applications, automations, and developer tools built fast."
        />

        <section className="mb-20">
          <SectionHeader
            title="Packages"
            subtitle="Choose a starting point — every engagement is tailored to your goals, timeline, and budget."
            className="mb-10"
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={cn(
                  "flex flex-col border-border bg-background py-6",
                  pkg.highlighted &&
                    "border-electric ring-1 ring-electric/30 lg:scale-[1.02]"
                )}
              >
                <CardHeader>
                  {pkg.highlighted && (
                    <span className="mb-2 w-fit rounded-full bg-electric/10 px-3 py-1 text-xs font-medium text-electric">
                      Most Popular
                    </span>
                  )}
                  <CardTitle className="text-xl text-foreground">
                    {pkg.name}
                  </CardTitle>
                  <p className="text-2xl font-bold text-electric">
                    {pkg.price}
                  </p>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {pkg.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-teal" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    variant={pkg.highlighted ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      pkg.highlighted &&
                        "bg-electric text-white hover:bg-electric/90"
                    )}
                  >
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20 hidden">
          <SectionHeader
            title="Freelance Platforms"
            subtitle="Prefer hiring through a marketplace? Find us on these platforms."
            className="mb-10"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {freelancePlatforms.map((platform) => (
              <Card
                key={platform.name}
                className="border-border bg-background py-6 transition hover:border-electric/50"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg text-foreground">
                    {platform.name}
                    <ArrowUpRight className="size-5 text-electric" />
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {platform.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on {platform.name}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Common questions about working with MS DevX."
            className="mb-10"
          />

          <div className="mx-auto max-w-3xl rounded-xl border border-border bg-background px-4 sm:px-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.hire.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger className="text-left text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-electric/5 px-6 py-12 text-center sm:px-10">
          <h2 className="text-2xl font-bold text-foreground">
            Ready to move fast?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Tell us about your project and we&apos;ll respond with a clear plan,
            timeline, and next steps — no fluff, no hard sell.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 bg-electric text-white hover:bg-electric/90"
          >
            <Link href="/contact">Start Your Project</Link>
          </Button>
        </section>

        <RelatedLinks links={relatedLinks} />
      </div>
    </main>
  );
}
