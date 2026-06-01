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

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy" },
];

const relatedLinks = [
  {
    href: "/contact",
    label: "Contact Us",
    description: "Have questions about your data? Get in touch.",
  },
  {
    href: "/about",
    label: "About MS DevX",
    description: "Learn more about our mission and values.",
  },
  {
    href: "/services",
    label: "Our Services",
    description: "Explore AI and SaaS development services.",
  },
];

const sections = [
  {
    title: "Information We Collect",
    content: (
      <>
        <p>
          We do <strong>not</strong> collect any personal data through our
          mobile applications. Our apps require <strong>no sign-up, no
          account creation, and no special permissions</strong>. We do
          not access your location, camera, contacts, photos, or any other
          device data.
        </p>
        <p className="mt-3">
          Since we collect nothing, there is nothing to store, share, or
          sell.
        </p>
      </>
    ),
  },
  {
    title: "Advertising (AdMob)",
    content: (
      <>
        <p>
          The free version of our apps uses{" "}
          <strong>Google AdMob</strong> to serve advertisements. AdMob
          may collect device identifiers and usage data to deliver
          interest-based ads. Data handling by AdMob is governed by{" "}
          <Link
            href="https://policies.google.com/privacy"
            className="text-electric hover:underline"
          >
            Google&apos;s Privacy Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    title: "Payments",
    content: (
      <>
        <p>
          The paid version of our apps uses{" "}
          <strong>Google Play Store in-app purchases</strong> to unlock
          the full experience. All payment processing is handled entirely
          by Google Play Store. We <strong>never receive, process, or
          store</strong> any payment or financial information.
        </p>
      </>
    ),
  },
  {
    title: "Data Retention",
    content: (
      <>
        <p>
          Since our apps collect no personal data, there is no data to
          retain. We do not store, process, or have access to any user
          information from app usage.
        </p>
      </>
    ),
  },
  {
    title: "Children&apos;s Privacy",
    content: (
      <>
        <p>
          Our apps do not knowingly collect any personal information from
          children under the age of 13. If we become aware that a child
          has provided us with personal data, we will take steps to
          delete it promptly.
        </p>
      </>
    ),
  },
  {
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated effective date. We encourage you
          to review this policy periodically.
        </p>
      </>
    ),
  },
  {
    title: "Contact",
    content: (
      <>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please{" "}
          <Link
            href="/contact"
            className="text-electric hover:underline"
          >
            reach out to us
          </Link>
          .
        </p>
      </>
    ),
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Privacy Policy",
    description: `Privacy policy for ${siteConfig.name} mobile apps. Our apps collect no personal data — no sign-up, no permissions, no tracking.`,
    path: "/privacy",
    keywords: [...pageKeywords.privacy],
  });
}

export default function PrivacyPage() {
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
          title="Privacy Policy"
          subtitle={`Last updated: June 1, 2026 — How ${siteConfig.name} handles your data.`}
        />

        <div className="mx-auto max-w-3xl space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <RelatedLinks links={relatedLinks} />
      </div>
    </main>
  );
}
