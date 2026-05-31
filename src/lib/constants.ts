import type { NavItem, SocialLink, ToolCategory } from "./types";

export const siteConfig = {
  name: "MS DevX",
  tagline: "Build smarter. Ship faster.",
  description:
    "MS DevX is an indie AI studio building modern tools, apps, and developer-first solutions.",
  url: "https://msdevx.com",
  siteUrl: "https://msdevx.com",
  toolsUrl: "https://tools.marth.systems",
  contactEmail: "marthsystems@gmail.com",
  author: "Shahzad Marth",
  colors: {
    navy: "#0F1B2D",
    electric: "#4A9EFF",
    sky: "#7BB8FF",
    teal: "#1D9E75",
    offwhite: "#F1EFE8",
    ink: "#0A0A0A",
  },
};

export const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Apps", href: "/apps" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Hire", href: "/hire" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/msdevx",
    icon: "github",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/msdevx",
    icon: "twitter",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/company/msdevx",
    icon: "linkedin",
  },
];

export const toolCategories: ToolCategory[] = [
  "AI",
  "Productivity",
  "Islamic",
  "Student",
  "PDF",
  "Utility",
];

export const appCategories = [
  "All",
  "Productivity",
  "Islamic",
  "Student",
  "PDF",
  "AI",
];

