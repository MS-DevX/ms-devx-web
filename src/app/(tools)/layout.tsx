import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ThemeToggle from "@/components/shared/ThemeToggle";
import type { ToolsLayoutProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ToolsLayout({ children }: ToolsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col border-t-4 border-electric bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="container flex h-14 items-center justify-between py-3 sm:h-16 sm:py-0">
          <div className="flex items-center gap-4">
            <Link
              href="/tools"
              aria-label="MS DevX Tools Hub"
              className="text-base font-bold text-foreground transition hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 sm:text-lg"
            >
              MS DevX Tools
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Back to MS DevX homepage"
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition",
                "hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
              )}
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to MS DevX</span>
              <span className="sm:hidden">Main site</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container flex-1 py-8 sm:py-10">{children}</main>
    </div>
  );
}
