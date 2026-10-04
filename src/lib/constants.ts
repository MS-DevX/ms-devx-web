import type { NavItem, SocialLink, ToolCategory } from "./types";

export const siteConfig = {
  name: "MS DevX",
  tagline: "Build Smarter. Ship Faster.",
  description:
    "MS DevX is an indie studio building AI-powered tools and apps for modern users.",
  url: "https://msdevx.com",
  siteUrl: "https://msdevx.com",
  toolsUrl: "https://msdevx.com/tools",
  contactEmail: "support@marthsystems.com",
  author: "Shahzad Marth",
  /** Legal publisher name used on Play Store privacy policies. */
  publisher: "Marth Systems",
  colors: {
    cyan: "#06B6D4",
    blue: "#2563EB",
    purple: "#7C3AED",
    slate: "#0F172A",
    white: "#FFFFFF",
  },
};

export const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Apps", href: "/apps" },
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/MS-DevX",
    icon: "github",
  },
  {
    name: "Twitter",
    url: "https://x.com/MSDevX",
    icon: "twitter",
  },
];

export const toolCategories: ToolCategory[] = [
  "AI",
  "Productivity",
  "Islamic",
  "Student",
  "PDF",
  "Utility",
  "Health",
  "Finance",
  "Date & Time",
  "Math",
  "Text",
  "Security",
  "Academic",
];

export const appCategories = [
  "All",
  "Productivity",
  "Islamic",
  "Student",
  "Education",
  "PDF",
  "AI",
  "Games",
  "Utility",
];

