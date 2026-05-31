import Link from "next/link";
import { Suspense } from "react";

import CopyrightText from "@/components/shared/CopyrightText";
import SocialLinks from "@/components/shared/SocialLinks";
import { navLinks, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn("border-t border-white/10 bg-background", className)}
    >
      <div className="container grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-bold text-navy dark:text-white">
            {siteConfig.name}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {siteConfig.tagline}
          </p>

          <div className="mt-4">
            <SocialLinks />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-navy dark:text-white">
            Navigation
          </h3>

          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition hover:text-electric"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-navy dark:text-white">
            About
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <Suspense
            fallback={
              <p>© {siteConfig.name}. All rights reserved.</p>
            }
          >
            <CopyrightText />
          </Suspense>

          <p className="text-electric">{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
