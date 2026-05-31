"use client";

import { Star } from "lucide-react";

import { SectionHeader } from "@/components/shared/SectionHeader";
import testimonials from "@/content/data/testimonials.json";
import { cn } from "@/lib/utils";

export interface TestimonialsSectionProps {
  className?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating
              ? "fill-electric text-electric"
              : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  item,
}: {
  item: (typeof testimonials)[number];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-background p-6 transition hover:shadow-lg">
      <p className="text-sm leading-relaxed text-muted-foreground">
        &ldquo;{item.quote}&rdquo;
      </p>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-navy dark:text-white">{item.name}</p>
          <p className="text-xs text-muted-foreground">
            {item.role} · {item.company}
          </p>
        </div>

        <StarRating rating={item.rating} />
      </div>
    </div>
  );
}

export default function TestimonialsSection({
  className,
}: TestimonialsSectionProps) {
  return (
    <section className={cn("py-20", className)}>
      <div className="container">
        <SectionHeader
          title="What Clients Say"
          subtitle="Real feedback from founders, creators, and teams who built with MS DevX."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
