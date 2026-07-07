import type { Metadata } from "next";
import Link from "next/link";

import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  buildPageMetadata,
  combineSchemas,
  createBreadcrumbSchema,
  pageKeywords,
} from "@/lib/seo";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "MS Unit Converter Privacy", path: "/msunit-privacy" },
];

const relatedLinks = [
  {
    href: "/apps",
    label: "Explore Our Apps",
    description: "Discover other tools and applications designed by MS DevX.",
  },
  {
    href: "/contact",
    label: "Contact Support",
    description: "Have questions about MS Unit Converter's data practices? Get in touch.",
  },
];

const supportEmail = "msdevxsupport@gmail.com";

const sections = [
  {
    title: "1. Overview & Local-First Architecture",
    content: (
      <p>
        MS Unit Converter is a 100% local-first application. Unit conversions
        work entirely offline with no server dependency. You do not need to
        sign up, create an account, or log in. All your preferences,
        favorites, and history stay securely on your device.
      </p>
    ),
  },
  {
    title: "2. Data We Process",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground text-sm">Conversion History & Favorites</h4>
          <p className="mt-1">
            <strong>What:</strong> A log of recent unit conversions and your bookmarked category indices.<br />
            <strong>Where:</strong> Stored locally in SharedPreferences. Capped at 20 entries (history).<br />
            <strong>Why:</strong> To provide a convenient history view and quick access to your favorite categories.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Currency Exchange Rates</h4>
          <p className="mt-1">
            <strong>What:</strong> Live exchange rates fetched from the Frankfurter API (free, no API key).<br />
            <strong>Where:</strong> Cached locally in SharedPreferences for offline use. The last-fetch timestamp is also stored locally.<br />
            <strong>Why:</strong> To power the currency converter. Frankfurter is a public API and does not receive any personal data from the app.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Compass Heading (Magnetic & True North)</h4>
          <p className="mt-1">
            <strong>What:</strong> Magnetic heading computed from the device accelerometer and magnetometer. True north additionally uses GPS location to correct for magnetic declination.<br />
            <strong>Where:</strong> Processed entirely on-device. Raw sensor data never leaves your device.<br />
            <strong>Why:</strong> To provide accurate directional information. The magnetic compass starts without requesting any permissions.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Bubble Level / Inclinometer</h4>
          <p className="mt-1">
            <strong>What:</strong> Pitch and roll angles computed from the accelerometer.<br />
            <strong>Where:</strong> Processed entirely on-device. No sensor data is transmitted.<br />
            <strong>Why:</strong> To provide a spirit-level tool using the device's built-in sensors.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">GPS Location (User-Opt-In Only)</h4>
          <p className="mt-1">
            <strong>What:</strong> GPS coordinates (latitude and longitude).<br />
            <strong>Where:</strong> Used on-device purely to calculate magnetic declination for the true north compass correction.<br />
            <strong>Why:</strong> Only requested when you explicitly tap "Enable True North". The magnetic compass works without location permission. If denied, magnetic north continues to function.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">App Settings & Preferences</h4>
          <p className="mt-1">
            <strong>What:</strong> Theme selection (light/dark/system), decimal precision, premium (ads removed) status.<br />
            <strong>Where:</strong> Stored locally in SharedPreferences. Never leaves your device.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "3. Data We Do NOT Collect",
    content: (
      <>
        <p className="mb-3">MS Unit Converter never collects, transmits, or stores the following data:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Name, email address, phone number</li>
          <li>Device identifiers (IMEI, Android ID)</li>
          <li>Browsing history, contacts, microphone, camera</li>
          <li>Crash reports or error logs sent to any cloud service</li>
          <li>Analytics or usage telemetry</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Advertising (App Open Ad)",
    content: (
      <p>
        MS Unit Converter uses <strong>Google AdMob</strong> to display App Open Ads
        (a full-screen ad shown when the app is launched or resumed after 4+ hours in
        the background). Google may use your <strong>Advertising ID</strong> to serve
        personalized ads and for fraud prevention. The ad is shown at most once every
        4 hours. If you purchase the "Remove Ads" in-app product, ads are permanently
        disabled. Google&apos;s privacy policy applies to AdMob data:{" "}
        <Link href="https://policies.google.com/privacy" className="text-electric hover:underline" target="_blank" rel="noopener noreferrer">
          policies.google.com/privacy
        </Link>.
      </p>
    ),
  },
  {
    title: "5. In-App Purchase (Remove Ads)",
    content: (
      <p>
        The &ldquo;Remove Ads&rdquo; product is processed entirely by the{" "}
        <strong>Google Play Billing Library</strong>. We{" "}
        <strong>never receive, process, or store</strong> any payment or financial
        information. A local flag indicating whether the purchase has been made is
        stored in SharedPreferences on your device. Restoring purchases is handled
        entirely through Google Play.
      </p>
    ),
  },
  {
    title: "6. Permissions Explained",
    content: (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs my-4">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="py-2 px-3 font-semibold text-foreground">Permission</th>
              <th className="py-2 px-3 font-semibold text-foreground">Required</th>
              <th className="py-2 px-3 font-semibold text-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/40">
              <td className="py-2 px-3 font-mono">INTERNET</td>
              <td className="py-2 px-3 text-red-500 font-medium">Yes</td>
              <td className="py-2 px-3">AdMob ads, currency rate fetching, and IAP verification.</td>
            </tr>
            <tr className="border-b border-border/40">
              <td className="py-2 px-3 font-mono">ACCESS_FINE_LOCATION</td>
              <td className="py-2 px-3 font-medium">No</td>
              <td className="py-2 px-3">True north compass correction (user opt-in only). Magnetic compass works without it.</td>
            </tr>
            <tr className="border-b border-border/40">
              <td className="py-2 px-3 font-mono">ACCESS_COARSE_LOCATION</td>
              <td className="py-2 px-3 font-medium">No</td>
              <td className="py-2 px-3">Fallback location when GPS unavailable.</td>
            </tr>
          </tbody>
        </table>
        <p className="text-[11px] text-muted-foreground mt-2">
          <code>INTERNET</code> is required for core functionality (currency rates, ads). Location permissions are only used when you explicitly enable true north on the compass.
        </p>
      </div>
    ),
  },
  {
    title: "7. Children's Privacy",
    content: (
      <p>
        MS Unit Converter does <strong>not</strong> knowingly collect any data from
        children under the age of 13. The app is a general utility tool and does not
        contain content directed at children in the sense of COPPA.
      </p>
    ),
  },
  {
    title: "8. Contact Us",
    content: (
      <p>
        If you have any questions or concerns about this Privacy Policy or MS Unit
        Converter's data practices, please reach out to us at{" "}
        <Link href={`mailto:${supportEmail}`} className="text-electric hover:underline font-medium">
          {supportEmail}
        </Link>
        .
      </p>
    ),
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "MS Unit Converter Privacy Policy | MS DevX",
    absoluteTitle: true,
    description: "Privacy Policy for MS Unit Converter — a 100% local-first unit converter, currency rates, compass, and toolset app by MS DevX. No data leaves your device.",
    path: "/msunit-privacy",
    keywords: [...pageKeywords.privacy, "MS Unit Converter", "unit converter privacy", "local-first app"],
  });
}

export default function MsUnitPrivacyPage() {
  return (
    <main className="py-20">
      <JsonLd
        data={combineSchemas(
          createBreadcrumbSchema(breadcrumbs)
        )}
      />

      <div className="container">
        <PageBreadcrumbs items={breadcrumbs} />

        <SectionHeader
          title="MS Unit Converter Privacy Policy"
          subtitle="Effective Date: July 2026 — Unit converter, currency rates, compass, and toolset by MS DevX."
        />

        <div className="mx-auto max-w-3xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 text-sm leading-relaxed text-muted-foreground">
            <p className="lead text-base font-medium text-foreground mb-6">
              MS Unit Converter is a 100% local-first application designed by MS DevX. Your data stays on your device. We do not operate any servers that collect, store, or process personal information from your conversions or tool usage.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title} className="border-b border-border/40 pb-8 last:border-0 last:pb-0">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {section.title}
                </h2>
                <div className="text-sm leading-relaxed text-muted-foreground prose prose-neutral dark:prose-invert max-w-none">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>

        <RelatedLinks links={relatedLinks} />
      </div>
    </main>
  );
}
