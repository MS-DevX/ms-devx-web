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
  { name: "SyncDue Privacy", path: "/syncdue-privacy" },
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
    description: "Have questions about SyncDue's offline architecture? Get in touch.",
  },
];

const supportEmail = "msdevxsupport@gmail.com";

const sections = [
  {
    title: "1. 100% Offline by Design",
    content: (
      <p>
        SyncDue is a local-only app. It does not require you to sign up, create an
        account, or log in. All information you enter in the app stays securely on
        your device.
      </p>
    ),
  },
  {
    title: "2. No Data Collection or Sharing",
    content: (
      <p>
        We do not collect, store, or share any personal data, usage telemetry,
        identifiers, or location data. There are no tracking scripts, analytics,
        or third-party advertising SDKs integrated into SyncDue.
      </p>
    ),
  },
  {
    title: "3. Data Stored on Your Device",
    content: (
      <>
        <p>The following information is stored strictly locally on your Android device:</p>
        <ul className="mt-3 list-disc list-inside space-y-2">
          <li>
            <strong>Deadlines:</strong> Title, dates, notes, categories, and priorities (stored in a local SQLite database).
          </li>
          <li>
            <strong>Reminders:</strong> Local schedule information for notification triggers.
          </li>
          <li>
            <strong>App Lock Credentials:</strong> If you enable the optional App Lock, a SHA-256 hash of your PIN is stored in your device&apos;s secure hardware-backed storage (<code>flutter_secure_storage</code>). We never see or store your raw PIN.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "4. No Internet Access",
    content: (
      <p>
        SyncDue does not request the Android <code>INTERNET</code> permission. The app is physically incapable of making network requests, connecting to external servers, or transmitting your data.
      </p>
    ),
  },
  {
    title: "5. Local Notifications & Alarms",
    content: (
      <p>
        SyncDue schedules reminders entirely on-device using local system alarm managers. No push notification services (such as Firebase Cloud Messaging) are used.
      </p>
    ),
  },
  {
    title: "6. Backups & Restore",
    content: (
      <p>
        When you choose to export your data backup, a JSON file is created locally on your device. You have total control over where this file is saved or shared. SyncDue does not upload backups to any server or cloud.
      </p>
    ),
  },
  {
    title: "7. Data Retention & Deletion",
    content: (
      <>
        <p>Because all data is stored on-device, you have full control over data deletion:</p>
        <ul className="mt-3 list-disc list-inside space-y-2">
          <li>Deleting a deadline in the app removes it permanently.</li>
          <li>Uninstalling SyncDue wipes all local databases and secure app preferences.</li>
          <li>Overwriting your data via the local backup import feature replaces existing records.</li>
        </ul>
      </>
    ),
  },
  {
    title: "8. Google Play Data Safety Compliance",
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Data Collected:</strong> None.
        </li>
        <li>
          <strong>Data Shared:</strong> None.
        </li>
        <li>
          <strong>Data Encryption:</strong> N/A (no data leaves the device).
        </li>
        <li>
          <strong>Data Deletion:</strong> Yes (via app uninstall or manual clearing).
        </li>
      </ul>
    ),
  },
  {
    title: "9. Contact Us",
    content: (
      <p>
        If you have any questions about this Privacy Policy or SyncDue&apos;s offline architecture, please contact us at{" "}
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
    title: "SyncDue Privacy Policy | MS DevX",
    absoluteTitle: true,
    description: "Privacy Policy for SyncDue - a 100% offline, local-first deadline and commitment tracker app. Your data stays on your device.",
    path: "/syncdue-privacy",
    keywords: [...pageKeywords.privacy, "SyncDue", "offline deadline tracker", "local-first app"],
  });
}

export default function SyncDuePrivacyPage() {
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
          title="SyncDue Privacy Policy"
          subtitle="Effective Date: July 3, 2026 — Offline deadline and commitment tracker by MS DevX."
        />

        <div className="mx-auto max-w-3xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 text-sm leading-relaxed text-muted-foreground">
            <p className="lead text-base font-medium text-foreground mb-6">
              SyncDue is a personal deadline and commitment tracker designed by MS DevX. Privacy is our core foundation. This Privacy Policy explains our commitment to protecting your information.
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
