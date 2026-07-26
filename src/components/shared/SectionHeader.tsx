import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeader({
  title,
  subtitle,
  className,
  as = "h2",
}: SectionHeaderProps) {
  const Heading = as;

  return (
    <div className={cn("mx-auto mb-12 max-w-2xl text-center", className)}>
      <Heading className="text-3xl font-bold text-foreground">{title}</Heading>

      {subtitle && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
