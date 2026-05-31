"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface NavBarProps {
  className?: string;
}

export default function NavBar({ className }: NavBarProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-lg",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-electric bg-navy text-white">
            <svg
              viewBox="0 0 100 100"
              className="h-5 w-5 rotate-45"
              fill="none"
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

          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold text-navy dark:text-white">
              MS
            </span>
            <span className="text-xs font-medium tracking-widest text-electric">
              DEVX
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-electric",
                  isActive ? "text-electric" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <div className="mt-10 flex flex-col gap-5">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-base font-medium transition-colors",
                        isActive
                          ? "text-electric"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
