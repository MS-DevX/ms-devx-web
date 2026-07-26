/**
 * Shared display-logic helpers for app cards.
 *
 * Both FeaturedApps.tsx and AppsPageClient.tsx must use these functions so
 * that badges and button visibility are always determined by the same rules.
 *
 * Single source of truth:
 *   - Badge text/style is driven by `status` + `closedTesting`, NOT `badge`.
 *     `badge` is only rendered for live apps (e.g. "Free", "Paid", "AdMob").
 *   - Play Store button is only shown when there is no `landingPage`.
 *     When a landingPage exists, "Learn More" is the primary CTA.
 */


// ─── Badge ────────────────────────────────────────────────────────────────────

export type AppBadgeVariant = "gradient" | "outline-muted";

export interface AppBadgeInfo {
  label: string;
  /** "gradient" → colored pill (live apps). "outline-muted" → subtle outline (coming soon). */
  variant: AppBadgeVariant;
}

/**
 * Returns the badge label and visual variant for an app card.
 *
 * Priority:
 *   1. coming-soon + closedTesting → "Closed Testing" (outline-muted)
 *   2. coming-soon                 → "Coming Soon"     (outline-muted)
 *   3. live (or no status)         → app.badge value   (gradient)
 */
export function getAppBadge(app: {
  status?: string;
  closedTesting?: boolean | null;
  badge: string;
}): AppBadgeInfo {
  if (app.status === "coming-soon") {
    return {
      label: app.closedTesting ? "Closed Testing" : "Coming Soon",
      variant: "outline-muted",
    };
  }
  return { label: app.badge, variant: "gradient" };
}

// ─── Buttons ─────────────────────────────────────────────────────────────────

export interface AppButtonConfig {
  /** Show "Learn More" linking to landingPage. Always takes priority. */
  showLearnMore: boolean;
  landingPage: string | null | undefined;

  /**
   * Show "Play Store" button — only when there is no landingPage.
   * When coming-soon, the button is rendered but disabled.
   */
  showPlayStore: boolean;
  playStoreUrl: string | null | undefined;
  playStoreDisabled: boolean;

  /** Show "Web" button — only when there is no landingPage. */
  showWeb: boolean;
  webUrl: string | null | undefined;
  webDisabled: boolean;
}

/**
 * Returns which buttons to display on an app card and how.
 *
 * Rules:
 *   - If landingPage is set → only show "Learn More"; hide Play Store / Web.
 *   - If no landingPage → show Play Store and/or Web (disabled when coming-soon).
 */
export function getAppButtons(app: {
  status?: string;
  landingPage?: string | null;
  playStoreUrl?: string | null;
  webUrl?: string | null;
}): AppButtonConfig {
  const isComingSoon = app.status === "coming-soon";
  const hasLandingPage = Boolean(app.landingPage);

  return {
    showLearnMore: hasLandingPage,
    landingPage: app.landingPage,

    showPlayStore: !hasLandingPage && Boolean(app.playStoreUrl),
    playStoreUrl: app.playStoreUrl,
    playStoreDisabled: isComingSoon,

    showWeb: !hasLandingPage && Boolean(app.webUrl),
    webUrl: app.webUrl,
    webDisabled: isComingSoon,
  };
}
