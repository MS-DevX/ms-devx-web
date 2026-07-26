"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface StatsBarProps {
  className?: string;
}

/**
 * Counts up from `target` to `target` — i.e. starts at the final value on
 * SSR and during initial paint, then only plays the count-up animation on
 * the client when the element scrolls into view.
 *
 * This ensures:
 *  - Crawlers / no-JS / SSR see the real number immediately (not "0").
 *  - Users with JS get the animated count-up on first scroll-into-view.
 *  - `trigger` is only true after hydration, so the animation is always
 *    a client-only progressive enhancement.
 */
function useCounter(target: number, trigger: boolean) {
  // Default to `target` so SSR output and the initial paint both show the
  // real number. The count-up animation is purely additive on top of that.
  const [count, setCount] = useState(target);

  useEffect(() => {
    if (!trigger) return;

    // Reset to 0 at the start of the animation (client-only).
    setCount(0);

    let current = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [trigger, target]);

  return count;
}

export default function StatsBar({ className }: StatsBarProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  const apps = useCounter(12, isInView);
  const tools = useCounter(10, isInView);
  const countries = useCounter(6, isInView);

  return (
    <section
      ref={ref}
      className={cn(
        "border-y border-border bg-background py-12",
        className
      )}
    >
      <div className="container grid grid-cols-3 gap-6 text-center md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-3xl font-bold text-electric">{apps}+</p>
          <p className="text-sm text-muted-foreground">Apps Built</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-3xl font-bold text-electric">{tools}+</p>
          <p className="text-sm text-muted-foreground">AI Tools</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-3xl font-bold text-electric">{countries}+</p>
          <p className="text-sm text-muted-foreground">Countries</p>
        </motion.div>
      </div>
    </section>
  );
}
