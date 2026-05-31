"use client";

import { Button } from "@/components/ui/button";
import type { CategoryFilterProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((cat) => (
        <Button
          key={cat}
          type="button"
          variant={active === cat ? "default" : "outline"}
          onClick={() => onChange(cat)}
          className={cn(
            "shrink-0 whitespace-nowrap text-sm transition",
            active === cat && "bg-electric text-white hover:bg-electric/90"
          )}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
