import Link from "next/link";

import type { BreadcrumbItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PageBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function PageBreadcrumbs({
  items,
  className,
}: PageBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-8", className)}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-foreground/30">
                  /
                </span>
              )}
              {isLast ? (
                <span
                  className="font-medium text-navy dark:text-white"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="transition hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
