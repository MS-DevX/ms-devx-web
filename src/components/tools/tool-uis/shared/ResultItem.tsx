"use client";

interface ResultItemProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export default function ResultItem({
  label,
  value,
  highlight = false,
}: ResultItemProps) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
      <span className="text-muted-foreground text-sm md:text-base">
        {label}
      </span>
      <span
        className={`font-semibold ${highlight ? "text-primary text-lg" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}
