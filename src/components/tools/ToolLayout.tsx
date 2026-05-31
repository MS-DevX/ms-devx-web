import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileInput,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ToolLayoutProps, ToolStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const howItWorksSteps: {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    step: 1,
    title: "Input data",
    description:
      "Enter your content, upload a file, or paste the information this tool needs to process.",
    icon: FileInput,
  },
  {
    step: 2,
    title: "Process with AI logic",
    description:
      "Our engine applies intelligent processing to transform your input — mocked for now, ready for live AI in production.",
    icon: Sparkles,
  },
  {
    step: 3,
    title: "Get output instantly",
    description:
      "Review, copy, or download your result immediately — no waiting, no extra steps.",
    icon: Download,
  },
];

const relatedToolPlaceholders = [
  "Related Tool 1",
  "Related Tool 2",
  "Related Tool 3",
] as const;

function getStatusBadgeClass(status: ToolStatus): string {
  if (status === "live") {
    return "border-teal/40 bg-teal/10 text-teal";
  }

  return "border-white/20 bg-muted/50 text-muted-foreground";
}

export default function ToolLayout({
  title,
  description,
  status,
  children,
}: ToolLayoutProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 text-muted-foreground hover:text-electric"
        >
          <Link href="/tools">
            <ArrowLeft className="size-4" />
            Back to Tools Hub
          </Link>
        </Button>

        <header className="space-y-4">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="text-3xl font-bold text-navy dark:text-white sm:text-4xl">
              {title}
            </h1>
            {status && (
              <Badge
                variant="outline"
                className={cn("mt-1", getStatusBadgeClass(status))}
              >
                {status === "live" ? "Live" : "Coming Soon"}
              </Badge>
            )}
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </header>
      </div>

      <section
        aria-label="Tool workspace"
        className="rounded-xl border border-white/10 bg-background p-5 shadow-sm sm:p-8"
      >
        {children}
      </section>

      <section aria-labelledby="how-it-works-heading">
        <h2
          id="how-it-works-heading"
          className="mb-6 text-xl font-semibold text-navy dark:text-white"
        >
          How it works
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {howItWorksSteps.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.step}
                className="border-white/10 bg-background py-5 transition hover:border-electric/30 hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-electric/10 text-sm font-bold text-electric">
                      {item.step}
                    </span>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-electric/10">
                      <Icon className="size-4 text-electric" />
                    </div>
                  </div>
                  <CardTitle className="text-base text-navy dark:text-white">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="related-tools-heading">
        <h2
          id="related-tools-heading"
          className="mb-6 text-xl font-semibold text-navy dark:text-white"
        >
          Related Tools
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {relatedToolPlaceholders.map((label) => (
            <Card
              key={label}
              className="border-white/10 bg-background py-5 transition hover:-translate-y-0.5 hover:border-electric/30 hover:shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-base text-navy dark:text-white">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Discover another utility from the MS DevX Tools Hub.
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
