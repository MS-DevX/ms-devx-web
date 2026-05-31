import type { Metadata } from "next";

import { siteConfig, socialLinks } from "@/lib/constants";
import type {
  BlogPost,
  BreadcrumbItem,
  HireFaqItem,
  Service,
  Tool,
} from "@/lib/types";

export const DEFAULT_OG_PATH = "/opengraph-image";

export type SeoHost = "main" | "tools";

export type { BreadcrumbItem };

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  host?: SeoHost;
  keywords?: string[];
  noIndex?: boolean;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  images?: string[];
  /** When true, title is not merged with the root template */
  absoluteTitle?: boolean;
}

/** Public path on the tools subdomain (no `/tools` prefix). */
export function toolsPublicPath(slug?: string): string {
  if (!slug) return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function absoluteUrl(path: string, host: SeoHost = "main"): string {
  const base =
    host === "tools"
      ? siteConfig.toolsUrl.replace(/\/$/, "")
      : siteConfig.url.replace(/\/$/, "");

  const normalizedPath =
    host === "tools" && path.startsWith("/tools/")
      ? toolsPublicPath(path.replace(/^\/tools\/?/, "") || undefined)
      : path.startsWith("/")
        ? path
        : `/${path}`;

  return `${base}${normalizedPath}`;
}

export function resolveImageUrl(imagePath: string): string {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return absoluteUrl(imagePath.startsWith("/") ? imagePath : `/${imagePath}`);
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const host = input.host ?? "main";
  const canonical = absoluteUrl(input.path, host);
  const ogImages =
    input.images && input.images.length > 0
      ? input.images.map((image) => ({
          url: resolveImageUrl(image),
          width: 1200,
          height: 630,
          alt: input.title,
        }))
      : [
          {
            url: absoluteUrl(DEFAULT_OG_PATH, "main"),
            width: 1200,
            height: 630,
            alt: `${siteConfig.name} — ${siteConfig.tagline}`,
          },
        ];

  const title = input.absoluteTitle
    ? { absolute: input.title }
    : input.title;

  return {
    title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical,
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: host === "tools" ? `${siteConfig.name} Tools` : siteConfig.name,
      type: input.ogType ?? "website",
      locale: "en_US",
      images: ogImages,
      ...(input.publishedTime && { publishedTime: input.publishedTime }),
      ...(input.modifiedTime && { modifiedTime: input.modifiedTime }),
      ...(input.authors && { authors: input.authors }),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: ogImages.map((image) => image.url),
    },
  };
}

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(DEFAULT_OG_PATH),
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    sameAs: socialLinks.map((link) => link.url),
  };
}

export function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function createAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${siteConfig.name}`,
    url: absoluteUrl("/about"),
    description:
      "Learn the story, mission, values, and technology behind MS DevX.",
    mainEntity: createOrganizationSchema(),
  };
}

export function createServiceSchemas(services: Service[]) {
  return services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: "Worldwide",
    url: absoluteUrl("/services"),
  }));
}

export function createProfessionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: absoluteUrl("/hire"),
    description:
      "Hire MS DevX for AI products, SaaS development, automation systems, and consulting.",
    email: siteConfig.contactEmail,
    areaServed: "Worldwide",
    priceRange: "$$",
    serviceType: [
      "AI Product Development",
      "SaaS Development",
      "Automation Systems",
      "Technical Consulting",
    ],
  };
}

export function createBlogSchema(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} Blog`,
    url: absoluteUrl("/blog"),
    description:
      "Insights, engineering notes, and build-in-public updates from MS DevX.",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.date,
      description: post.description,
    })),
  };
}

export function createBlogPostingSchema(post: BlogPost) {
  const image = post.coverImage
    ? resolveImageUrl(post.coverImage)
    : absoluteUrl(DEFAULT_OG_PATH);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(DEFAULT_OG_PATH),
      },
    },
    image,
    keywords: post.tags.join(", "),
    timeRequired: `PT${post.readingTime}M`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
  };
}

export function createCollectionPageSchema(options: {
  name: string;
  description: string;
  path: string;
  host?: SeoHost;
  items: { name: string; url: string }[];
}) {
  const host = options.host ?? "main";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name,
    description: options.description,
    url: absoluteUrl(options.path, host),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: host === "tools" ? siteConfig.toolsUrl : siteConfig.url,
    },
    hasPart: options.items.map((item) => ({
      "@type": "WebApplication",
      name: item.name,
      url: item.url,
    })),
  };
}

export function createSoftwareApplicationSchema(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: absoluteUrl(toolsPublicPath(tool.slug), "tools"),
    applicationCategory: tool.category,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function createBreadcrumbSchema(
  items: BreadcrumbItem[],
  host: SeoHost = "main"
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, host),
    })),
  };
}

export function createFAQPageSchema(faqs: HireFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function combineSchemas(...schemas: Record<string, unknown>[]) {
  return schemas;
}

/** Default keywords reused across marketing pages */
export const pageKeywords = {
  home: [
    "MS DevX",
    "AI studio",
    "SaaS development",
    "indie hacker",
    "developer tools",
    "automation",
  ],
  services: [
    "AI product development",
    "SaaS builds",
    "automation services",
    "MS DevX services",
  ],
  apps: [
    "MS DevX apps",
    "AI apps",
    "productivity apps",
    "Android apps",
  ],
  blog: [
    "MS DevX blog",
    "AI engineering",
    "Next.js",
    "build in public",
  ],
  contact: [
    "contact MS DevX",
    "hire developer",
    "AI consulting",
  ],
  about: [
    "about MS DevX",
    "indie AI studio",
    "Shahzad Marth",
  ],
  hire: [
    "hire MS DevX",
    "freelance AI developer",
    "SaaS MVP",
    "automation consultant",
  ],
  tools: [
    "MS DevX tools",
    "free AI tools",
    "developer utilities",
    "online tools",
  ],
} as const;
