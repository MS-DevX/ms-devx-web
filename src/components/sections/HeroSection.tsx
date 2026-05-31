"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import AnimatedText from "@/components/shared/AnimatedText";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn("relative overflow-hidden py-24 md:py-32", className)}
    >
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="h-full w-full bg-[radial-gradient(#4A9EFF_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="container text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-navy md:text-6xl dark:text-white"
        >
          <AnimatedText text="Build smarter." delay={0.2} />{" "}
          <AnimatedText
            text="Ship faster."
            delay={0.4}
            className="text-electric"
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          {siteConfig.tagline} — AI tools, apps, and systems built for modern
          developers and indie founders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link href="/apps">
            <Button className="px-6 py-3 text-base">Explore Apps</Button>
          </Link>

          <Link href="/tools">
            <Button
              variant="outline"
              className="border-electric px-6 py-3 text-base text-electric hover:bg-electric hover:text-white"
            >
              Try Tools
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
