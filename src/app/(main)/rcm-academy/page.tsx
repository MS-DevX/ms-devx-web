import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  LineChart,
  Shield,
  Users,
} from "lucide-react";

import RCMAcademyClient from "@/app/(main)/rcm-academy/RCMAcademyClient";
import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
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
  { name: "RCM Academy", path: "/rcm-academy" },
];

const relatedLinks = [
  {
    href: "/apps",
    label: "All Apps",
    description: "Browse every application built by MS DevX.",
  },
  {
    href: "/blog/introducing-rcm-academy",
    label: "Blog: Introducing RCM Academy",
    description: "Read the story behind RCM Academy.",
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Get in touch with MS DevX.",
  },
];

const careerPaths = [
  {
    title: "Credentialing Specialist",
    description:
      "Verify medical provider qualifications, monitor regulations, and maintain NCQA compliance.",
    difficulty: "Beginner",
    hours: 60,
    weeks: 12,
    courses: 4,
  },
  {
    title: "Provider Enrollment Specialist",
    description:
      "Link medical providers to Medicare, Medicaid, and commercial insurance payer networks.",
    difficulty: "Beginner",
    hours: 70,
    weeks: 14,
    courses: 4,
  },
  {
    title: "Medical Billing Specialist",
    description:
      "Manage claim submission, billing lifecycles, clearinghouses, and payment resolution.",
    difficulty: "Intermediate",
    hours: 80,
    weeks: 16,
    courses: 4,
  },
  {
    title: "Medical Coding Specialist",
    description:
      "Translate clinical documentation into standardized ICD-10, CPT, and HCPCS codes.",
    difficulty: "Intermediate",
    hours: 90,
    weeks: 18,
    courses: 4,
  },
  {
    title: "Revenue Cycle Specialist",
    description:
      "Optimize administrative and financial operations from scheduling to final balance resolution.",
    difficulty: "Advanced",
    hours: 100,
    weeks: 20,
    courses: 4,
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description:
      "Structured lesson blocks with real-world scenarios, not just text. Learn by doing, not just reading.",
  },
  {
    icon: ClipboardCheck,
    title: "Quizzes & Assessments",
    description:
      "Test your knowledge after every module with industry-relevant questions and instant feedback.",
  },
  {
    icon: Brain,
    title: "Simulations",
    description:
      "Practice real RCM workflows — claim submissions, denial appeals, credentialing cycles — in a safe environment.",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    description:
      "Visual dashboards showing your learning streak, completed modules, and career path progress.",
  },
  {
    icon: GraduationCap,
    title: "Career Paths",
    description:
      "5 structured career paths from beginner to advanced, each with 4 courses and 60-100 hours of content.",
  },
  {
    icon: Shield,
    title: "Industry-Aligned",
    description:
      "Curriculum built on real-world RCM expertise from Marth Systems — not generic healthcare content.",
  },
];

const targetAudience = [
  {
    icon: GraduationCap,
    title: "Students",
    description:
      "Healthcare administration students looking to specialize in revenue cycle management.",
  },
  {
    icon: Users,
    title: "Medical Billers",
    description:
      "Working billers who want to deepen their knowledge of claim workflows and denial management.",
  },
  {
    icon: Shield,
    title: "Credentialing Specialists",
    description:
      "Professionals managing provider credentials, NCQA compliance, and payer enrollments.",
  },
  {
    icon: BookOpen,
    title: "Practice Managers",
    description:
      "Leaders who need to understand the full revenue cycle to optimize practice finances.",
  },
];

const stats = [
  { value: "5", label: "Career Paths" },
  { value: "20", label: "Courses" },
  { value: "400+", label: "Hours of Content" },
  { value: "100%", label: "Practical" },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title:
      "RCM Academy — Master Revenue Cycle Management | MS DevX",
    absoluteTitle: true,
    description:
      "Learn Revenue Cycle Management through interactive lessons, quizzes, and simulations. 5 career paths, 20 courses, 400+ hours of healthcare billing and coding education.",
    path: "/rcm-academy",
    keywords: [
      "RCM academy",
      "revenue cycle management",
      "medical billing training",
      "medical coding course",
      "credentialing certification",
      "healthcare education",
      "ICD-10 training",
      "CPT coding",
      "payer enrollment",
      ...pageKeywords.apps,
    ],
  });
}

export default function RCMAcademyPage() {
  return (
    <main className="py-20">
      <JsonLd
        data={combineSchemas(createBreadcrumbSchema(breadcrumbs))}
      />

      <div className="container">
        <PageBreadcrumbs items={breadcrumbs} />

        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge className="mb-4 bg-gradient-primary text-white border-0">
            Coming Soon
          </Badge>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            RCM Academy
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Master Revenue Cycle Management through interactive lessons,
            quizzes, and real-world simulations. Built for healthcare
            professionals who want to level up.
          </p>
          <p className="mt-2 text-sm text-electric font-medium">
            Powered by real-world RCM expertise from Marth Systems
          </p>
        </div>

        <div className="mx-auto mb-20 max-w-xl">
          <RCMAcademyClient />
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
            title="5 Career Paths"
            subtitle="Structured learning paths from beginner to advanced — each designed to take you from zero to job-ready."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {careerPaths.map((path) => (
              <Card
                key={path.title}
                className="border-border bg-background py-6"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    {path.title}
                  </CardTitle>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {path.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {path.hours}h
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {path.weeks} weeks
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {path.courses} courses
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {path.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="Features"
            subtitle="Everything you need to master RCM — built for how people actually learn."
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
            title="Who It's For"
            subtitle="Whether you're starting out or leveling up, RCM Academy has a path for you."
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {targetAudience.map((person) => {
              const Icon = person.icon;
              return (
                <Card
                  key={person.title}
                  className="border-border bg-background py-6"
                >
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-electric/10">
                      <Icon className="size-5 text-electric" />
                    </div>
                    <CardTitle className="text-lg text-foreground">
                      {person.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {person.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            title="What You'll Learn"
            subtitle="Core RCM competencies covered across all career paths."
          />

          <div className="mx-auto max-w-3xl">
            <ul className="space-y-4">
              {[
                "Credentialing & provider enrollment workflows",
                "NCQA standards and compliance requirements",
                "Medicare & Medicaid enrollment (PECOS, CMS-855)",
                "Medical billing lifecycle (CMS-1500, UB-04, clearinghouses)",
                "ICD-10-CM, CPT, and HCPCS coding systems",
                "Denial management and appeal processes",
                "Revenue cycle analytics and KPIs",
                "AI applications in healthcare RCM",
              ].map((topic) => (
                <li
                  key={topic}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-electric" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-electric/5 px-6 py-12 text-center sm:px-10">
          <h2 className="text-2xl font-bold text-foreground">
            Ready to master RCM?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            RCM Academy is launching soon on Google Play. Sign up above to get
            notified the moment it goes live.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/blog/introducing-rcm-academy"
              className="text-sm text-electric underline-offset-4 hover:underline"
            >
              Read the full story
            </Link>
          </div>
        </section>

        <RelatedLinks links={relatedLinks} />
      </div>
    </main>
  );
}
