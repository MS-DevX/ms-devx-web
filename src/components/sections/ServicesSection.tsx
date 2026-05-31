"use client";

import Link from "next/link";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import services from "@/content/data/services.json";
import { cn } from "@/lib/utils";

export interface ServicesSectionProps {
  className?: string;
}

export default function ServicesSection({ className }: ServicesSectionProps) {
  return (
    <section className={cn("py-20", className)}>
      <div className="container">
        <SectionHeader
          title="What We Build"
          subtitle="AI-powered systems, SaaS products, and automation tools designed for speed and scale."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-white/10 bg-background p-6 transition hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold text-navy dark:text-white">
                  {service.title}
                </h3>

                <Badge variant="outline">Service</Badge>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {service.description}
              </p>

              <div className="mt-6 grid gap-3">
                {service.tiers.map((tier, index) => (
                  <div
                    key={index}
                    className={cn(
                      "rounded-lg border p-4 transition",
                      tier.highlighted
                        ? "border-electric bg-electric/5"
                        : "border-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-navy dark:text-white">
                        {tier.name}
                      </h4>

                      <span className="text-sm font-semibold text-electric">
                        {tier.price}
                      </span>
                    </div>

                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {tier.features.map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-electric text-white hover:bg-electric/90">
            <Link href="/services">View all services</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/hire">Hire MS DevX</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
