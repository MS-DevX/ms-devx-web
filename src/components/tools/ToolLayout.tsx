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

function getStatusBadgeClass(status: ToolStatus): string {
  if (status === "live") {
    return "border-teal/40 bg-teal/10 text-teal-700 dark:text-teal-300";
  }

  return "border-border bg-muted/50 text-muted-foreground";
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
          className="mb-6 -ml-2 text-muted-foreground hover:text-blue dark:hover:text-electric"
        >
          <Link href="/tools">
            <ArrowLeft className="size-4" />
            Back to Tools Hub
          </Link>
        </Button>

        <header className="space-y-4">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
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
        className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8"
      >
        {children}
      </section>

      <section aria-labelledby="how-it-works-heading">
        <h2
          id="how-it-works-heading"
          className="mb-6 text-xl font-semibold text-foreground"
        >
          How it works
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {howItWorksSteps.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.step}
                className="border-border bg-card py-5 transition hover:border-blue/30 dark:hover:border-electric/30 hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue/10 dark:bg-electric/10 text-sm font-bold text-blue-700 dark:text-electric">
                      {item.step}
                    </span>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-blue/10 dark:bg-electric/10">
                      <Icon className="size-4 text-blue-700 dark:text-electric" />
                    </div>
                  </div>
                  <CardTitle className="text-base text-foreground">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
