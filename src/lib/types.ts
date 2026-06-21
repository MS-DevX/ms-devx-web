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
  status?: ToolStatus;
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

export interface BlogCardProps {
  post: BlogPost;
}

export interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
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

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactPageClientProps {
  className?: string;
  faqs?: HireFaqItem[];
}

export interface ContactApiSuccessResponse {
  success: true;
  message: string;
}

export interface ContactApiErrorResponse {
  success: false;
  error: string;
  details?: Record<string, string[] | undefined>;
}

export type ContactApiResponse =
  | ContactApiSuccessResponse
  | ContactApiErrorResponse;

export interface AboutTimelineItem {
  title: string;
  description: string;
}

export interface AboutValue {
  title: string;
  description: string;
}

export interface HirePackage {
  id: string;
  name: string;
  price: string;
  features: string[];
  highlighted: boolean;
}

export interface HireFaqItem {
  question: string;
  answer: string;
}

export interface FreelancePlatform {
  name: string;
  description: string;
  url: string;
}

export interface ToolsLayoutProps {
  children: React.ReactNode;
}

export interface MainLayoutProps {
  children: React.ReactNode;
}

export interface ToolLayoutProps {
  title: string;
  description: string;
  status?: ToolStatus;
  children: React.ReactNode;
}

export interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export interface ToolUiProps {
  className?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
}

export interface NutritionResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  label: string;
}

export interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export interface BackToTopProps {
  className?: string;
}

export interface RootLayoutProps {
  children: React.ReactNode;
}

export interface ThemeToggleProps {
  className?: string;
}

export interface BlogPageClientProps {
  posts: BlogPost[];
}

export interface ToolsHubPageClientProps {
  tools: Tool[];
}

export interface PrayerTime {
  name: string;
  time: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface RelatedLinkItem {
  href: string;
  label: string;
  description?: string;
}

export interface FaqData {
  hire: HireFaqItem[];
  contact: HireFaqItem[];
}

