import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn("relative overflow-hidden py-28 md:py-36", className)}
    >
      {/* Decorative background */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-cyan/20 via-blue/20 to-purple/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-purple/20 via-blue/20 to-cyan/20 blur-3xl" />
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="h-full w-full bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div className="container text-center relative z-10">
        <div>
          {/* Logo mark - LCP Element: priority loaded, zero JS delay */}
          <div className="flex justify-center mb-8">
            <Image 
              src="/logo-mark.svg" 
              alt="MS DevX Logo Mark" 
              width={120} 
              height={120}
              priority
              fetchPriority="high"
            />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
          Build <span className="text-gradient">Smarter</span>. Ship <span className="text-gradient">Faster</span>.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-muted-foreground">
          {siteConfig.description}
        </p>

        <div className="mt-12 flex flex-col md:flex-row justify-center gap-4">
          <Button size="lg" asChild variant="gradient" className="text-lg px-8 py-4">
            <Link href="/apps">
              Explore Apps
            </Link>
          </Button>

          <Button size="lg" asChild variant="outline" className="text-lg px-8 py-4">
            <Link href="/tools">
              Try Tools
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
