"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface StatsBarProps {
  className?: string;
}

function useCounter(target: number, trigger: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
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
  const clients = useCounter(25, isInView);
  const countries = useCounter(6, isInView);

  return (
    <section
      ref={ref}
      className={cn(
        "border-y border-border bg-background py-12",
        className
      )}
    >
      <div className="container grid grid-cols-2 gap-6 text-center md:grid-cols-4">
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
          <p className="text-3xl font-bold text-electric">{clients}+</p>
          <p className="text-sm text-muted-foreground">Clients Served</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-3xl font-bold text-electric">{countries}+</p>
          <p className="text-sm text-muted-foreground">Countries</p>
        </motion.div>
      </div>
    </section>
  );
}
