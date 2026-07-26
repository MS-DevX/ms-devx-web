"use client";

import Image from "next/image";
import { useState } from "react";

interface AppIconProps {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
}

/**
 * Renders an app icon from `src`. If no src is provided, or if the image fails
 * to load, it seamlessly falls back to the theme-aware generic placeholder SVG
 * so the UI never shows a broken-image indicator or 404 network error.
 */
export function AppIcon({ src, alt, size = 44, className = "" }: AppIconProps) {
  const initialSrc = src || "/apps/placeholder.svg";
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [errored, setErrored] = useState(false);

  const handleError = () => {
    if (!errored) {
      setErrored(true);
      setImgSrc("/apps/placeholder.svg");
    }
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imgSrc}
        alt={alt}
        width={size}
        height={size}
        className="rounded-xl object-contain"
        onError={handleError}
        unoptimized={imgSrc.endsWith(".svg")}
      />
    </span>
  );
}
