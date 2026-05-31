import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/constants";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${siteConfig.colors.navy}, ${siteConfig.colors.electric})`,
          color: "white",
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        <div>{siteConfig.name}</div>
        <div style={{ fontSize: 32, marginTop: 20, fontWeight: 500 }}>
          {siteConfig.tagline}
        </div>
      </div>
    ),
    size
  );
}
