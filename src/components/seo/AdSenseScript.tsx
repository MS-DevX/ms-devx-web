"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function AdSenseScript() {
  const pathname = usePathname();

  // Exclude AdSense script on homepage ("/") and apps listing page ("/apps")
  const isExcluded = pathname === "/" || pathname === "/apps";

  if (isExcluded) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8684958562988579"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
