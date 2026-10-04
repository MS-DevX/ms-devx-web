import type { Metadata } from "next";
import Link from "next/link";

import JsonLd from "@/components/seo/JsonLd";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { siteConfig } from "@/lib/constants";
import {
  buildPageMetadata,
  combineSchemas,
  createBreadcrumbSchema,
  pageKeywords,
} from "@/lib/seo";

const APP_PATH = "/apps/word-link-daily";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Apps", path: "/apps" },
  { name: "Word Link Daily", path: APP_PATH },
  { name: "Privacy Policy", path: "/wld-privacy" },
];

const relatedLinks = [
  {
    href: APP_PATH,
    label: "Word Link Daily",
    description: "Learn about the daily word-link puzzle game.",
  },
  {
    href: "/contact",
    label: "Contact Support",
    description: "Questions about Word Link Daily's data practices? Get in touch.",
  },
];

const supportEmail = siteConfig.contactEmail;

const sections = [
  {
    title: "1. Overview",
    content: (
      <>
        <p>
          Word Link Daily (the &ldquo;app&rdquo;) is published by{" "}
          {siteConfig.publisher} (&ldquo;we&rdquo;, &ldquo;us&rdquo;).
          This policy explains what information the app handles and why.
        </p>
        <p>
          <strong>
            We do not collect or store your name, email address, phone number,
            or any account information — the app has no user accounts,
            sign-in, or profiles.
          </strong>
        </p>
      </>
    ),
  },
  {
    title: "2. Information Stored on Your Device",
    content: (
      <p>
        The app stores your puzzle progress, statistics (streaks, completion
        times, words found), settings, the daily puzzle&apos;s cached content,
        and ad-frequency bookkeeping locally on your device. It never leaves
        your device except as described below.
      </p>
    ),
  },
  {
    title: "3. Puzzle Content Retrieval",
    content: (
      <p>
        Each day&apos;s puzzle is downloaded from our content server using a
        public, read-only connection. The request contains no personal
        information. Completed and in-progress puzzles work offline from the
        device cache.
      </p>
    ),
  },
  {
    title: "4. Usage Analytics",
    content: (
      <>
        <p>
          The app sends limited, anonymous usage events — for example puzzle
          started or completed, hint used, ad requested or shown, sync outcome,
          settings changed, and app errors — through the app platform&apos;s
          first-party analytics. Events carry coarse parameters only, such as
          puzzle difficulty, content version, hints used, and time bucket.
        </p>
        <p>
          <strong>
            They never contain puzzle answers, the words you find, or anything
            you type.
          </strong>{" "}
          Analytics helps us keep the game working and improve it.
        </p>
      </>
    ),
  },
  {
    title: "5. Error Reporting",
    content: (
      <p>
        If the app encounters an error, a report with the error message and
        limited technical context — app version, screen, and error category —
        may be recorded so we can fix the problem. Reports never include your
        progress contents or puzzle solutions.
      </p>
    ),
  },
  {
    title: "6. Advertising",
    content: (
      <p>
        <strong>The current release displays no ads.</strong> The app contains
        a rewarded-hint feature that may show a short video ad in exchange for
        an extra hint, but only in builds where advertising has been enabled.
        If that happens, ads are served by Google AdMob, which may use its own
        device identifiers subject to{" "}
        <Link
          href="https://policies.google.com/privacy"
          className="text-electric hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google&apos;s privacy policy
        </Link>{" "}
        and your consent choices. This section will be updated to describe
        advertising before any such build ships.
      </p>
    ),
  },
  {
    title: "7. Children",
    content: (
      <p>
        We make no claim that the app is directed to children or excluded from
        them. If the app is published for an audience that includes children,
        the families-appropriate ads and consent configuration will be applied
        first.
      </p>
    ),
  },
  {
    title: "8. Your Choices",
    content: (
      <>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Reset local progress</strong> (Settings) deletes your
            on-device progress, statistics, and cached puzzles. It does not
            delete anonymous analytics records already sent — those are not
            personally identifiable — or any server-side puzzle content.
          </li>
          <li>
            <strong>Privacy Options</strong> (Settings) summarizes this policy
            inside the app.
          </li>
          <li>
            Since there are no accounts, there is no account-deletion feature;
            nothing personal exists to delete.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "9. Third-Party Services",
    content: (
      <>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Supabase</strong> — puzzle content hosting; receives
            anonymous read requests.
          </li>
          <li>
            <strong>Base44 app platform</strong> — hosting and first-party
            anonymous analytics.
          </li>
        </ul>
        <p className="mt-3">No other third-party SDKs are active in this build.</p>
      </>
    ),
  },
  {
    title: "10. Data Retention",
    content: (
      <p>
        Device data persists until you reset it or uninstall the app. Anonymous
        analytics events are retained by the platform per its standard
        retention practices.
      </p>
    ),
  },
  {
    title: "11. Changes to This Policy",
    content: (
      <p>
        We will update this policy if the app&apos;s data practices change, and
        update the &ldquo;Last updated&rdquo; date at the top of this page when
        we do.
      </p>
    ),
  },
  {
    title: "12. Contact Us",
    content: (
      <p>
        If you have any questions or concerns about this Privacy Policy or Word
        Link Daily&apos;s data practices, please reach us at{" "}
        <Link
          href={`mailto:${supportEmail}`}
          className="font-medium text-electric hover:underline"
        >
          {supportEmail}
        </Link>
        .
      </p>
    ),
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Word Link Daily Privacy Policy | MS DevX",
    absoluteTitle: true,
    description:
      "Privacy Policy for Word Link Daily, the free daily word puzzle game by Marth Systems. No accounts, no sign-in, no personal data collected — read the full policy.",
    path: "/wld-privacy",
    keywords: [
      ...pageKeywords.privacy,
      "Word Link Daily privacy policy",
      "word link daily",
      "word puzzle privacy",
      "no account word game",
    ],
  });
}

export default function WordLinkDailyPrivacyPage() {
  return (
    <main className="py-20">
      <JsonLd data={combineSchemas(createBreadcrumbSchema(breadcrumbs))} />

      <div className="container">
        <PageBreadcrumbs items={breadcrumbs} />

        <SectionHeader
          title="Word Link Daily Privacy Policy"
          subtitle={`Last updated: October 2026 — the daily word-link puzzle by ${siteConfig.publisher}.`}
        />

        <div className="mx-auto max-w-3xl">
          <div className="prose prose-neutral mb-10 max-w-none text-sm leading-relaxed text-muted-foreground dark:prose-invert">
            <p className="lead mb-6 text-base font-medium text-foreground">
              Word Link Daily has no accounts and no sign-in. There is no profile
              to create and nothing personal to hand over. This page explains
              exactly what the app stores, what it sends, and why.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section
                key={section.title}
                className="border-b border-border/40 pb-8 last:border-0 last:pb-0"
              >
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  {section.title}
                </h2>
                <div className="prose prose-neutral max-w-none text-sm leading-relaxed text-muted-foreground dark:prose-invert">
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