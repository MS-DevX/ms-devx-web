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
  { name: "Muslim Companion Privacy", path: "/mc-privacy" },
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
    description: "Have questions about Muslim Companion's offline architecture? Get in touch.",
  },
];

const supportEmail = "msdevxsupport@gmail.com";

const sections = [
  {
    title: "1. Overview & Offline Architecture",
    content: (
      <p>
        Muslim Companion is designed as a <strong>privacy-first</strong> application.
        Your personal data stays on your device. We do <strong>not</strong> operate any servers
        that collect, store, or process personal information. All prayer time calculations,
        Qibla direction, and app functionality run entirely <strong>on-device</strong>.
      </p>
    ),
  },
  {
    title: "2. Data We Process",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground text-sm">Location (GPS & Manual Coordinates)</h4>
          <p className="mt-1">
            <strong>What:</strong> Device GPS coordinates (latitude and longitude) or manually entered location coordinates (latitude, longitude, and an optional city name).<br />
            <strong>Why:</strong> To calculate accurate prayer times and Qibla direction.<br />
            <strong>Where:</strong> Used entirely on-device. Never transmitted to any server.<br />
            <strong>Storage:</strong> GPS coordinates are not persisted (recalculated fresh on each app launch). Manually entered coordinates are stored locally in the device&apos;s private storage (SharedPreferences) and are never uploaded to the cloud.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Notification Permission</h4>
          <p className="mt-1">
            <strong>What:</strong> The Android system permission to post local notifications.<br />
            <strong>Why:</strong> Required on Android 13+ (API 33+) to display prayer time alerts and daily reminders.<br />
            <strong>Where:</strong> Managed entirely by the Android OS. Not transmitted anywhere.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Prayer Completion Log</h4>
          <p className="mt-1">
            <strong>What:</strong> A record of which prayers you have marked as completed each day.<br />
            <strong>Where:</strong> Stored locally in SharedPreferences on your device only.<br />
            <strong>Retention:</strong> Automatically truncated by the OS. Not backed up to any cloud service.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">App Settings & Preferences</h4>
          <p className="mt-1">
            <strong>What:</strong> Your calculation method, Asr method, notification toggles, reminder times, Hifz progress.<br />
            <strong>Where:</strong> Stored locally in SharedPreferences. Never leaves your device.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Tasbeeh / Dhikr Counter Data</h4>
          <p className="mt-1">
            <strong>What:</strong> Active preset selection, custom dhikr phrases, current session counts, daily recitation history (logs per day), and vibration/haptic preference.<br />
            <strong>Where:</strong> Stored locally in SharedPreferences. Never leaves your device.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Local User Profile</h4>
          <p className="mt-1">
            <strong>What:</strong> Display name, avatar emoji, avatar color, city label, and preferred location mode (GPS vs. manual).<br />
            <strong>Why:</strong> To personalize the Today screen dashboard (e.g., displaying greetings and avatar icons) and store your preferences for location lookup.<br />
            <strong>Where:</strong> Stored locally in SharedPreferences. This data is strictly offline and is never transmitted to any server.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Local Data Backup (Export & Import)</h4>
          <p className="mt-1">
            <strong>What:</strong> A serialized JSON string containing your settings, custom reminders, bookmarks, Hifz progress, custom dhikr phrases, session counts, and recitation history.<br />
            <strong>Why:</strong> To allow you to manually copy your data to another device or backup locally.<br />
            <strong>Where:</strong> Handled strictly on-device. The data is copied to your clipboard when exporting and read from your input field when importing. It is never transmitted to any cloud server or database.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">In-App Purchase (when enabled)</h4>
          <p className="mt-1">
            <strong>What:</strong> Purchase status of the &ldquo;Remove Ads&rdquo; product.<br />
            <strong>Why:</strong> To determine whether to show App Open Ads.<br />
            <strong>Where:</strong> Verified against the Google Play Billing Library on-device. A local cache flag is stored in SharedPreferences. Purchase receipts are handled entirely by Google Play. We do not receive or store payment information.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "3. Data We Do NOT Collect",
    content: (
      <>
        <p className="mb-3">Muslim Companion never collects, transmits, or stores the following data:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Name, email address, phone number</li>
          <li>Device identifiers (IMEI, Android ID)</li>
          <li>Browsing history, contacts, microphone, camera</li>
          <li>Crash reports sent to any cloud service</li>
          <li>Analytics or usage telemetry</li>
          <li>Quran reading history uploaded to any server</li>
          <li>Hifz progress synchronized to any cloud</li>
          <li>Islamic calendar notes or events synced to any cloud</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Advertising (App Open Ad)",
    content: (
      <p>
        When enabled at build time (<code>ENABLE_ADS=true</code>): We display <strong>App Open Ads</strong> only, provided by Google AdMob. Google may use your <strong>Advertising ID</strong> to serve personalized ads. The ad is shown at most once every 4 hours and never to users who purchased &ldquo;Remove Ads&rdquo;. Google&apos;s privacy policy applies to AdMob data:{" "}
        <Link href="https://policies.google.com/privacy" className="text-electric hover:underline" target="_blank" rel="noopener noreferrer">
          policies.google.com/privacy
        </Link>. When <code>ENABLE_ADS=false</code> (the default for development builds), no ad SDK is initialized and no data is shared with Google AdMob.
      </p>
    ),
  },
  {
    title: "5. Permissions Explained",
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
              <td className="py-2 px-3 font-mono">ACCESS_FINE_LOCATION</td>
              <td className="py-2 px-3 text-red-500 font-medium">Yes*</td>
              <td className="py-2 px-3">Prayer time calculation, Qibla direction. (Graceful failure if denied)</td>
            </tr>
            <tr className="border-b border-border/40">
              <td className="py-2 px-3 font-mono">ACCESS_COARSE_LOCATION</td>
              <td className="py-2 px-3 font-medium">No</td>
              <td className="py-2 px-3">Fallback location when GPS unavailable.</td>
            </tr>
            <tr className="border-b border-border/40">
              <td className="py-2 px-3 font-mono">POST_NOTIFICATIONS</td>
              <td className="py-2 px-3 font-medium">No</td>
              <td className="py-2 px-3">Prayer time alerts on Android 13+. (Reminders silently skipped if denied)</td>
            </tr>
            <tr className="border-b border-border/40">
              <td className="py-2 px-3 font-mono">SCHEDULE_EXACT_ALARM</td>
              <td className="py-2 px-3 font-medium">No</td>
              <td className="py-2 px-3">Precise prayer time scheduling. (Falls back to inexact)</td>
            </tr>
            <tr className="border-b border-border/40">
              <td className="py-2 px-3 font-mono">USE_EXACT_ALARM</td>
              <td className="py-2 px-3 font-medium">No</td>
              <td className="py-2 px-3">Precise alarms on Android 14+. (Falls back to inexact)</td>
            </tr>
            <tr className="border-b border-border/40">
              <td className="py-2 px-3 font-mono">INTERNET</td>
              <td className="py-2 px-3 font-medium">Conditional</td>
              <td className="py-2 px-3">AdMob and IAP when enabled.</td>
            </tr>
            <tr className="border-b border-border/40">
              <td className="py-2 px-3 font-mono">RECEIVE_BOOT_COMPLETED</td>
              <td className="py-2 px-3 font-medium">No</td>
              <td className="py-2 px-3">Reschedule notifications after reboot.</td>
            </tr>
            <tr className="border-b border-border/40">
              <td className="py-2 px-3 font-mono">VIBRATE</td>
              <td className="py-2 px-3 font-medium">No</td>
              <td className="py-2 px-3">Notification vibration & Tasbeeh tactile feedback.</td>
            </tr>
          </tbody>
        </table>
        <p className="text-[11px] text-muted-foreground mt-2">
          * <code>ACCESS_FINE_LOCATION</code> is conditionally required — needed for GPS-based location but gracefully disabled when using manual coordinates.
        </p>
      </div>
    ),
  },
  {
    title: "6. Children's Privacy",
    content: (
      <p>
        Muslim Companion does <strong>not</strong> knowingly collect any data from children under 13.
        The app contains no content directed at children in the sense of COPPA.
      </p>
    ),
  },
  {
    title: "7. Contact Us",
    content: (
      <p>
        If you have any questions or concerns about this Privacy Policy, please reach out to us at{" "}
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
    title: "Muslim Companion Privacy Policy | MS DevX",
    absoluteTitle: true,
    description: "Muslim Companion is privacy-first: prayer times, Qibla direction, and all calculations happen locally on your device. No data leaves your phone.",
    path: "/mc-privacy",
    keywords: [...pageKeywords.privacy, "Muslim Companion", "offline prayer times", "Qibla direction", "Islamic app privacy"],
  });
}

export default function MuslimCompanionPrivacyPage() {
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
          title="Muslim Companion Privacy Policy"
          subtitle="Effective Date: July 3, 2026 — Privacy-first Muslim Companion app by MS DevX."
        />

        <div className="mx-auto max-w-3xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 text-sm leading-relaxed text-muted-foreground">
            <p className="lead text-base font-medium text-foreground mb-6">
              Muslim Companion is designed as a privacy-first application. Your personal data stays on your device. We do not operate any servers that collect, store, or process personal information.
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
