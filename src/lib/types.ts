export type ToolStatus = "live" | "coming-soon";

export type BadgeType = "Free" | "AdMob" | "Paid" | "New";

export interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  iconUrl: string;
  playStoreUrl?: string;
  webUrl?: string;
  badge: BadgeType;
  featured: boolean;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: ToolStatus;
  featured: boolean;
}

export interface ServiceTier {
  name: string;
  price: string;
  features: string[];
  highlighted: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  tiers: ServiceTier[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  author: string;
  coverImage: string;
  readingTime: number;
  featured: boolean;
  content?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export type ToolCategory =
  | "AI"
  | "Productivity"
  | "Islamic"
  | "Student"
  | "PDF"
  | "Utility";

