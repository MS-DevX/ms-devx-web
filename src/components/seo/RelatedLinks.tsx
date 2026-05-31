import Link from "next/link";

import type { RelatedLinkItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RelatedLinksProps {
  title?: string;
  links: RelatedLinkItem[];
  className?: string;
}

export default function RelatedLinks({
  title = "Explore more",
  links,
  className,
}: RelatedLinksProps) {
  return (
    <aside
      className={cn(
        "mt-16 rounded-xl border border-white/10 bg-muted/20 p-6",
        className
      )}
      aria-label={title}
    >
      <h2 className="text-lg font-semibold text-navy dark:text-white">{title}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => {
          const className =
            "block rounded-lg border border-white/10 bg-background p-4 transition hover:border-electric/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2";
          const isExternal = link.href.startsWith("http");

          return (
            <li key={link.href}>
              {isExternal ? (
                <a
                  href={link.href}
                  className={className}
                  rel="noopener noreferrer"
                >
                  <span className="font-medium text-electric">{link.label}</span>
                  {link.description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {link.description}
                    </p>
                  )}
                </a>
              ) : (
                <Link href={link.href} className={className}>
                  <span className="font-medium text-electric">{link.label}</span>
                  {link.description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {link.description}
                    </p>
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
