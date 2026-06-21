import type { Metadata } from "next";
import Link from "next/link";
import { Home, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist or may have been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

function BrandLogo() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-electric bg-navy text-white">
      <svg
        viewBox="0 0 100 100"
        className="h-6 w-6 rotate-45"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="15"
          y="15"
          width="70"
          height="70"
          stroke="currentColor"
          strokeWidth="8"
        />
      </svg>
    </div>
  );
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-8xl font-bold tracking-tight text-electric sm:text-9xl">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
          Page Not Found
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="w-full bg-electric text-white hover:bg-electric/90 sm:w-auto"
          >
            <Link href="/">
              <Home />
              Back Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/tools">
              <Wrench />
              Explore Tools
            </Link>
          </Button>
        </div>

        <div className="mt-16 flex flex-col items-center gap-3 border-t border-border pt-10">
          <BrandLogo />
          <p className="text-lg font-bold text-foreground">
            {siteConfig.name}
          </p>
          <p className="text-sm text-electric">{siteConfig.tagline}</p>
        </div>
      </div>
    </main>
  );
}
