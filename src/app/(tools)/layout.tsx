import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import ThemeToggle from "@/components/shared/ThemeToggle";
import { Input } from "@/components/ui/input";
import type { ToolsLayoutProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ToolsLayout({ children }: ToolsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col border-t-4 border-electric bg-background">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/95 backdrop-blur-md">
        <div className="container flex h-14 flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
          <div className="flex items-center justify-between gap-4 sm:justify-start">
            <Link
              href="/tools"
              className="text-base font-bold text-navy transition hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 dark:text-white sm:text-lg"
            >
              MS DevX Tools
            </Link>

            <div className="flex items-center gap-2 sm:hidden">
              <ThemeToggle />
            </div>
          </div>

          <div className="flex flex-1 items-center gap-3 sm:max-w-md sm:justify-end lg:max-w-lg">
            <div className="relative hidden flex-1 sm:block">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search tools..."
                readOnly
                aria-label="Search tools"
                className="pl-9"
              />
            </div>

            <Link
              href="/"
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition",
                "hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
              )}
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to MS DevX</span>
              <span className="sm:hidden">Main site</span>
            </Link>

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="container pb-3 sm:hidden">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search tools..."
              readOnly
              aria-label="Search tools"
              className="pl-9"
            />
          </div>
        </div>
      </header>

      <div className="container flex-1 py-8 sm:py-10">{children}</div>
    </div>
  );
}
