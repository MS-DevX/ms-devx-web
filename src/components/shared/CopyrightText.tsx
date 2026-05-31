"use client";

import { siteConfig } from "@/lib/constants";

export default function CopyrightText() {
  return (
    <p>
      © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
    </p>
  );
}
