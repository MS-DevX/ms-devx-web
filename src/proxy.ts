import { NextRequest, NextResponse } from "next/server";

import {
  getMainSiteUrl,
  isMainSiteOnlyPath,
  isToolsHost,
} from "@/lib/hosts";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  if (!isToolsHost(host)) {
    return NextResponse.next();
  }

  if (isMainSiteOnlyPath(pathname)) {
    return NextResponse.redirect(getMainSiteUrl(pathname));
  }

  if (pathname.startsWith("/tools")) {
    const cleanPath = pathname.replace(/^\/tools/, "") || "/";
    return NextResponse.redirect(new URL(cleanPath, request.url));
  }

  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/tools", request.url));
  }

  return NextResponse.rewrite(new URL(`/tools${pathname}`, request.url));
}
