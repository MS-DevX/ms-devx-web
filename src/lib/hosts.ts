/** Production and local hostnames for multi-domain routing */
export const HOSTS = [
  "msdevx.com",
  "www.msdevx.com",
  "tools.msdevx.com",
  "localhost",
] as const;

export const TOOLS_HOSTNAME = "msdevx.com";
export const LEGACY_TOOLS_HOSTNAME = "tools.msdevx.com";

export const MAIN_HOSTNAMES = [
  "msdevx.com",
  "www.msdevx.com",
  "localhost",
] as const;

const MAIN_SITE_PREFIXES = [
  "/about",
  "/hire",
  "/contact",
  "/services",
  "/apps",
  "/blog",
  "/privacy",
  "/syncdue-privacy",
  "/muslim-companion",
] as const;

export function normalizeHost(host: string): string {
  return host.split(":")[0].toLowerCase();
}

export function isToolsHost(host: string): boolean {
  const hostname = normalizeHost(host);

  return (
    hostname === LEGACY_TOOLS_HOSTNAME ||
    hostname === "tools.localhost" ||
    hostname.endsWith(".tools.msdevx.com")
  );
}

export function isMainHost(host: string): boolean {
  const hostname = normalizeHost(host);

  if (isToolsHost(host)) {
    return false;
  }

  return (
    (MAIN_HOSTNAMES as readonly string[]).includes(hostname) ||
    hostname.endsWith(".localhost")
  );
}

export function isMainSiteOnlyPath(pathname: string): boolean {
  return MAIN_SITE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function getMainSiteUrl(pathname: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://msdevx.com";

  return `${base}${pathname}`;
}
