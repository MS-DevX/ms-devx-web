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
import { siteConfig } from "@/lib/constants";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Apps", path: "/apps" },
  { name: "RCM Academy", path: "/rcm-academy" },
  { name: "Privacy Policy", path: "/rcm-academy/privacy" },
];

const relatedLinks = [
  {
    href: "/rcm-academy",
    label: "RCM Academy",
    description: "Learn about the RCM Academy learning platform.",
  },
  {
    href: "/contact",
    label: "Contact Support",
    description: "Have questions about RCM Academy's data practices? Get in touch.",
  },
];

// Single source of truth for the support inbox (see siteConfig).
const supportEmail = siteConfig.contactEmail;

const sections = [
  {
    title: "1. Overview",
    content: (
      <p>
        RCM Academy is an educational platform designed to teach Revenue Cycle
        Management (RCM) through interactive lessons, quizzes, and simulations.
        This Privacy Policy explains how we handle data when you use the RCM
        Academy mobile application and related services.
      </p>
    ),
  },
  {
    title: "2. Data We Collect",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground text-sm">Account Information</h4>
          <p className="mt-1">
            <strong>What:</strong> Email address and display name provided during sign-up.<br />
            <strong>Why:</strong> To create and manage your learning account, track progress, and send launch notifications.<br />
            <strong>Where:</strong> Stored securely on our backend servers (Render) and database (Neon PostgreSQL). Never sold or shared with third parties.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Learning Progress</h4>
          <p className="mt-1">
            <strong>What:</strong> Course completions, quiz scores, lesson progress, streaks, and XP earned.<br />
            <strong>Why:</strong> To provide personalized learning dashboards, progress tracking, and leaderboards.<br />
            <strong>Where:</strong> Stored on our backend servers. Associated with your account. Not shared with third parties.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Device Information</h4>
          <p className="mt-1">
            <strong>What:</strong> Device model, OS version, and app version (for crash reporting and compatibility).<br />
            <strong>Why:</strong> To diagnose bugs, improve performance, and ensure compatibility across devices.<br />
            <strong>Where:</strong> Stored on our backend servers. Not linked to your identity beyond basic diagnostics.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "3. Data We Do NOT Collect",
    content: (
      <>
        <p className="mb-3">RCM Academy never collects, transmits, or stores the following data:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Patient records, PHI, or HIPAA-regulated data</li>
          <li>Medical billing data, claim numbers, or NPI numbers</li>
          <li>Payment or financial information (no in-app purchases currently)</li>
          <li>Contacts, microphone, camera, or calendar data</li>
          <li>Exact GPS location (not required for the app)</li>
          <li>Advertising IDs or tracking identifiers</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. How We Use Your Data",
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li>To provide and maintain the learning platform</li>
        <li>To track and display your learning progress</li>
        <li>To send launch notifications (only if you opted in)</li>
        <li>To diagnose and fix technical issues</li>
        <li>To improve the platform based on aggregated, anonymized usage patterns</li>
      </ul>
    ),
  },
  {
    title: "5. Data Sharing & Third Parties",
    content: (
      <p>
        We do <strong>not</strong> sell, rent, or share your personal data with third parties
        for advertising or marketing purposes. We use the following infrastructure
        providers solely for operating the service:
      </p>
    ),
  },
  {
    title: "6. Infrastructure Providers",
    content: (
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-foreground text-sm">Render (Hosting)</h4>
          <p className="mt-1">Hosts the backend API and admin panel. Data is stored in their secure cloud infrastructure.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Neon (Database)</h4>
          <p className="mt-1">PostgreSQL database provider. Stores account data and learning progress with encryption at rest.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">Google Play (Distribution)</h4>
          <p className="mt-1">Distributes the mobile app. Google&apos;s own data practices apply to app store metadata. See{" "}
            <Link href="https://policies.google.com/privacy" className="text-electric hover:underline" target="_blank" rel="noopener noreferrer">
              Google&apos;s Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "7. Data Security",
    content: (
      <p>
        We implement industry-standard security measures to protect your data,
        including encryption in transit (HTTPS/TLS) and encryption at rest in
        our database. Access to production data is restricted to authorized
        personnel only.
      </p>
    ),
  },
  {
    title: "8. Data Retention & Deletion",
    content: (
      <>
        <p className="mb-3">You have full control over your data:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>You can request account deletion by contacting us at the email below.</li>
          <li>Upon deletion, all your learning progress, account data, and personal information are permanently removed from our servers.</li>
          <li>We retain no backup copies after deletion is confirmed.</li>
        </ul>
      </>
    ),
  },
  {
    title: "9. Children's Privacy",
    content: (
      <p>
        RCM Academy does <strong>not</strong> knowingly collect data from children under 13.
        The app is designed for adult professionals and students in healthcare
        administration. It does not contain content directed at children in the
        sense of COPPA.
      </p>
    ),
  },
  {
    title: "10. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will
        be posted on this page with an updated effective date. Continued use
        of the app after changes constitutes acceptance of the updated policy.
      </p>
    ),
  },
  {
    title: "11. Contact Us",
    content: (
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        reach out to us at{" "}
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
    title: "RCM Academy Privacy Policy | MS DevX",
    absoluteTitle: true,
    description: "Privacy Policy for RCM Academy — an educational platform for Revenue Cycle Management. No PHI, no HIPAA data, no advertising trackers.",
    path: "/rcm-academy/privacy",
    keywords: [...pageKeywords.privacy, "RCM Academy", "revenue cycle management privacy", "healthcare education privacy"],
  });
}

export default function RCMAcademyPrivacyPage() {
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
          title="RCM Academy Privacy Policy"
          subtitle="Effective Date: July 26, 2026 — Educational platform for Revenue Cycle Management by MS DevX."
        />

        <div className="mx-auto max-w-3xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 text-sm leading-relaxed text-muted-foreground">
            <p className="lead text-base font-medium text-foreground mb-6">
              RCM Academy is an educational platform designed to teach Revenue Cycle Management. We do not process patient records, PHI, or HIPAA-regulated data. This policy explains what data we collect and how we protect it.
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
