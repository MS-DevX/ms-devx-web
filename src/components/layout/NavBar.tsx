"use client";

import Image from "next/image";
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
        "sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg",
        className
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/logo-horizontal-transparent.svg" 
            alt="MS DevX" 
            width={180} 
            height={48} 
            className="dark:hidden" 
          />
          <Image 
            src="/logo-horizontal-dark-background.svg" 
            alt="MS DevX" 
            width={180} 
            height={48} 
            className="hidden dark:block" 
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-semibold transition-all hover:text-blue",
                  isActive ? "text-blue" : "text-muted-foreground"
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
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <div className="mt-16 flex flex-col gap-6">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-lg font-semibold transition-colors",
                        isActive
                          ? "text-blue"
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
