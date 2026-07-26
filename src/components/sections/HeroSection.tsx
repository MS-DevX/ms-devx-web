"use client";

import { motion } from "framer-motion";
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Logo mark */}
          <div className="flex justify-center mb-8">
            <Image 
              src="/logo-mark.svg" 
              alt="MS DevX Logo Mark" 
              width={120} 
              height={120} 
            />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
        >
          Build <span className="text-gradient">Smarter</span>. Ship <span className="text-gradient">Faster</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-muted-foreground"
        >
          {siteConfig.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col md:flex-row justify-center gap-4"
        >
          <Link href="/apps">
            <Button size="lg" className="btn-primary text-lg px-8 py-4">
              Explore Apps
            </Button>
          </Link>

          <Link href="/tools">
            <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4">
              Try Tools
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
