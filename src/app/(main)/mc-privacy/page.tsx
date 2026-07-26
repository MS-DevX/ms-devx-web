import { permanentRedirect } from "next/navigation";

/**
 * /mc-privacy is deprecated.
 * The canonical Muslim Companion privacy policy lives at /muslim-companion/privacy.
 * next.config.ts handles the 301 at the edge; this server component acts as a
 * belt-and-suspenders fallback for any SSR hit that bypasses the redirect layer.
 */
export default function McPrivacyRedirect() {
  permanentRedirect("/muslim-companion/privacy");
}
