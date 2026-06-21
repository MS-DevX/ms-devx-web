# MS DevX Component Guide

Developer reference for the MS DevX component system. All TypeScript interfaces live in **`src/lib/types.ts`** unless noted. Site configuration lives in **`src/lib/constants.ts`**.

---

## Table of Contents

1. [Layout Components](#layout-components)
2. [Shared Components](#shared-components)
3. [Homepage Sections](#homepage-sections)
4. [Tool Components](#tool-components)
5. [Tool UI Components](#tool-ui-components)
6. [Data Layer](#data-layer)
7. [MS DevX Engineering Standards](#ms-devx-engineering-standards)

---

## Layout Components

### NavBar

**Path:** `src/components/layout/NavBar.tsx`  
**Type:** Client Component (`"use client"`)

**Purpose:** Sticky top navigation for the main marketing site. Renders logo, desktop nav links from `navLinks`, theme toggle, and mobile menu.

**Props:**

```typescript
export interface NavBarProps {
  className?: string;
}
```

**Usage:**

```tsx
import NavBar from "@/components/layout/NavBar";

<NavBar />
```

**Notes:** Used in `(main)/layout.tsx` only—not shown on the tools subdomain layout.

---

### Footer

**Path:** `src/components/layout/Footer.tsx`  
**Type:** Server Component

**Purpose:** Site footer with brand block, navigation links, and social icons.

**Props:**

```typescript
export interface FooterProps {
  className?: string;
}
```

**Usage:**

```tsx
import Footer from "@/components/layout/Footer";

<Footer />
```

---

### MobileMenu

**Path:** Implemented inside `NavBar.tsx` (not a separate file)  
**Type:** Client Component (shadcn `Sheet`)

**Purpose:** Collapsible navigation for viewports below the `md` breakpoint. Opens from the menu icon in the NavBar.

**Props:** None (internal to NavBar).

**Behavior:**

- Lists all `navLinks` from `@/lib/constants`
- Highlights active route via `usePathname()`
- Closes on navigation (standard Link behavior)

**Usage:** Automatic when using `<NavBar />`. To customize, edit the `Sheet` / `SheetContent` block in `NavBar.tsx`.

---

### ThemeToggle

**Path:** `src/components/shared/ThemeToggle.tsx`  
**Type:** Client Component

**Purpose:** Toggles light/dark mode via `next-themes`. Used in NavBar and tools layout header.

**Props:**

```typescript
export interface ThemeToggleProps {
  className?: string;
}
```

**Usage:**

```tsx
import ThemeToggle from "@/components/shared/ThemeToggle";

<ThemeToggle />
```

---

### SocialLinks

**Path:** `src/components/shared/SocialLinks.tsx`  
**Type:** Server Component

**Purpose:** Renders GitHub, Twitter/X, and LinkedIn links from `socialLinks` in constants.

**Props:**

```typescript
export interface SocialLinksProps {
  className?: string;
}
```

**Usage:**

```tsx
import SocialLinks from "@/components/shared/SocialLinks";

<SocialLinks className="mt-4" />
```

All links use `target="_blank"` and `rel="noopener noreferrer"`.

---

### BackToTop

**Path:** `src/components/shared/BackToTop.tsx`  
**Type:** Client Component

**Purpose:** Floating button (bottom-right) that appears after scrolling 300px and smooth-scrolls to top.

**Props:**

```typescript
export interface BackToTopProps {
  className?: string;
}
```

**Usage:**

```tsx
import BackToTop from "@/components/shared/BackToTop";

<BackToTop />
```

Mounted in root `src/app/layout.tsx` for global availability.

---

## Shared Components

### SectionHeader

**Path:** `src/components/shared/SectionHeader.tsx`  
**Type:** Server Component

**Purpose:** Centered section title and optional subtitle for consistent page/section typography.

**Props:**

```typescript
export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  className?: string;
}
```

**Usage:**

```tsx
import { SectionHeader } from "@/components/shared/SectionHeader";

<SectionHeader
  title="Our Services"
  subtitle="AI product development and automation."
  className="mb-12"
/>
```

---

### AnimatedText

**Path:** `src/components/shared/AnimatedText.tsx`  
**Type:** Client Component (Framer Motion)

**Purpose:** Fade-in-up text animation for hero and marketing emphasis.

**Props:**

```typescript
export interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}
```

**Usage:**

```tsx
import AnimatedText from "@/components/shared/AnimatedText";

<AnimatedText text="Ship faster." delay={0.4} className="text-electric" />
```

---

### AppCard

**Path:** Inline in `FeaturedApps.tsx` and `AppsPageClient.tsx` (not a standalone file)  
**Type:** Server or Client (parent-dependent)

**Purpose:** Card displaying an app from `apps.json` with name, description, category, badge, and store links.

**Props (inline pattern):**

```typescript
import type { App } from "@/lib/types";

function AppCard({ app }: { app: App }) {
  // …
}
```

**Usage (inside a parent that maps apps):**

```tsx
import apps from "@/content/data/apps.json";
import type { App } from "@/lib/types";

const data = apps as App[];

{data.map((app) => (
  <AppCard key={app.id} app={app} />
))}
```

**Extracting to a shared file:** Create `src/components/shared/AppCard.tsx` and move the inline implementation from `FeaturedApps.tsx` if you need reuse elsewhere.

---

### BlogCard

**Path:** Inline in `BlogTeaser.tsx`; blog index uses similar markup in `blog/page.tsx`  
**Type:** Server Component context

**Purpose:** Preview card for a blog post with title, description, date, reading time, and tags.

**Props (canonical type):**

```typescript
export interface BlogCardProps {
  post: BlogPost;
}
```

**Usage pattern:**

```tsx
import type { BlogPost } from "@/lib/types";

function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="rounded-xl border border-white/10 p-5">
      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      {/* … */}
    </div>
  );
}
```

---

## Homepage Sections

All section components live in `src/components/sections/`. Most accept optional `className`.

### HeroSection

**Path:** `src/components/sections/HeroSection.tsx`  
**Type:** Client Component

**Purpose:** Full-width hero with animated tagline, description, and primary CTAs (tools + contact).

**Props:** `HeroSectionProps { className?: string }`

**Responsibility:** First impression; drives users to tools and contact.

---

### StatsBar

**Path:** `src/components/sections/StatsBar.tsx`  
**Type:** Client Component (Framer Motion)

**Purpose:** Horizontal stats/metrics strip reinforcing studio credibility.

**Props:** `className?: string`

**Responsibility:** Social proof below hero.

---

### ServicesSection

**Path:** `src/components/sections/ServicesSection.tsx`  
**Type:** Client Component

**Purpose:** Summarizes service offerings; loads from `content/data/services.json`.

**Responsibility:** Bridge from marketing to `/services` page.

---

### TestimonialsSection

**Path:** `src/components/sections/TestimonialsSection.tsx`  
**Type:** Client Component

**Purpose:** Client quotes from `content/data/testimonials.json`.

**Responsibility:** Trust and social proof.

---

### FeaturedApps

**Path:** `src/components/sections/FeaturedApps.tsx`  
**Type:** Client Component

**Purpose:** Grid of featured apps (`featured: true` in `apps.json`) using inline `AppCard`.

**Props:** `FeaturedAppsProps { className?: string }`

**Responsibility:** Showcase product portfolio on homepage.

---

### BlogTeaser

**Path:** `src/components/sections/BlogTeaser.tsx`  
**Type:** Server Component with `Suspense`

**Purpose:** Latest three blog posts via `getAllPosts()`, with skeleton fallback and link to `/blog`.

**Props:** `BlogTeaserProps { className?: string }`

**Responsibility:** Content marketing entry point from homepage.

---

### AboutTeaser

**Status:** **Not included in v1.0.**

There is no `AboutTeaser` section on the homepage. About content lives on **`/about`** (`src/app/(main)/about/page.tsx`).

**To add one:** Create `src/components/sections/AboutTeaser.tsx` following the `BlogTeaser` pattern—short copy, link to `/about`, optional `SectionHeader`.

---

## Tool Components

### ToolLayout

**Path:** `src/components/tools/ToolLayout.tsx`  
**Type:** Server Component

**Purpose:** Standard wrapper for every individual tool page: header, status badge, back link, children slot, “How it works”, and related-tools placeholders.

**Props:**

```typescript
export interface ToolLayoutProps {
  title: string;
  description: string;
  status?: ToolStatus; // "live" | "coming-soon"
  children: React.ReactNode;
}
```

**Usage:**

```tsx
import ToolLayout from "@/components/tools/ToolLayout";
import ResumeBuilder from "@/components/tools/tool-uis/ResumeBuilder";

<ToolLayout
  title="AI Resume Builder"
  description="Generate modern resumes with live preview."
  status="live"
>
  <ResumeBuilder />
</ToolLayout>
```

**Architecture role:** Separates marketing chrome from tool logic. All tool UIs are client children inside this server shell.

---

### ToolCard

**Path:** Inline in `src/app/(tools)/tools/page.tsx` (Tools Hub)  
**Type:** Client Component (parent page)

**Purpose:** Card on the tools hub listing one tool with category badge, status badge, description, and CTA.

**Data source:** `content/data/tools.json` → `Tool` type.

**Behavior:**

- `status: "live"` → **Open Tool** links to `/tools/{slug}`
- `status: "coming-soon"` → disabled button

**Architecture role:** Discovery grid on the hub; pairs with `CategoryFilter` for future filtering.

---

### CategoryFilter

**Path:** `src/components/tools/CategoryFilter.tsx`  
**Type:** Client Component

**Purpose:** Horizontal scrollable category pills. Pure UI—parent owns state and filtering logic.

**Props:**

```typescript
export interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}
```

**Usage:**

```tsx
import CategoryFilter from "@/components/tools/CategoryFilter";
import { toolCategories } from "@/lib/constants";

const categories = ["All", ...toolCategories];

<CategoryFilter
  categories={categories}
  active={activeCategory}
  onChange={setActiveCategory}
/>
```

**Architecture role:** Interactive hub UX without coupling to data layer.

---

## Tool UI Components

All live in `src/components/tools/tool-uis/`. Each is a **Client Component** with **mock logic** (no real APIs in v1). All accept:

```typescript
export interface ToolUiProps {
  className?: string;
}
```

Common patterns: `useState`, `setTimeout` loading simulation, shadcn UI, `animate-in fade-in` outputs.

---

### ResumeBuilder

| | |
|---|---|
| **Purpose** | Build a resume from name, skills, and experience |
| **State** | `name`, `skills`, `experience`, `generated`, `loading`, `showOutput` |
| **Inputs** | Text fields + textarea |
| **Outputs** | Live preview panel + generated resume text block |

---

### CoverLetterWriter

| | |
|---|---|
| **Purpose** | Generate a cover letter from job description + experience |
| **State** | `jobDescription`, `experience`, `output`, `loading`, `showOutput` |
| **Inputs** | Two textareas |
| **Outputs** | Cover letter preview panel |

---

### PdfToolkit

| | |
|---|---|
| **Purpose** | Simulated PDF compress, merge, split, convert |
| **State** | Per-tab state object (`fileName`, `loading`, `success`, `message`) |
| **Inputs** | File upload per tab (shadcn Tabs) |
| **Outputs** | Success/error message after fake processing |

---

### PrayerTimes

| | |
|---|---|
| **Purpose** | Mock prayer times for a city + Qibla compass SVG |
| **State** | `city`, `loading`, `showTimes`, `compassRotation` |
| **Inputs** | City text field |
| **Outputs** | Fajr, Dhuhr, Asr, Maghrib, Isha list + rotating compass |

---

### HifzTracker

| | |
|---|---|
| **Purpose** | Quran memorization checklist (114 surahs) |
| **State** | `memorized` (Set), `streak` |
| **Inputs** | Checkbox per surah, streak increment button |
| **Outputs** | Progress bar percentage, streak counter |

---

### BusinessNameGenerator

| | |
|---|---|
| **Purpose** | Generate business names by keyword and style |
| **State** | `keyword`, `style`, `names[]`, `loading`, `showOutput` |
| **Inputs** | Keyword input, style select (Modern / Islamic / Tech / Startup) |
| **Outputs** | Grid of names with copy button |

---

### HomeworkHelper

| | |
|---|---|
| **Purpose** | Mock homework explanation |
| **State** | `inputMode`, `question`, `fileName`, `subject`, `answer`, `loading`, `showOutput` |
| **Inputs** | Text or file toggle, subject select, question/file |
| **Outputs** | Step-by-step explanation box |

---

### UnitConverter

| | |
|---|---|
| **Purpose** | Convert length, weight, temperature, speed |
| **State** | `category`, `fromUnit`, `toUnit`, `fromValue`, `toValue` |
| **Inputs** | Category select, two unit selects, two number inputs |
| **Outputs** | Instant bidirectional conversion (real formulas) |

---

### ExpenseTracker

| | |
|---|---|
| **Purpose** | Track expenses with running total |
| **State** | `title`, `amount`, `category`, `expenses[]` |
| **Inputs** | Add form fields |
| **Outputs** | Table of expenses, total sum, delete per row |

Uses `ExpenseItem` from `src/lib/types.ts`.

---

### CalorieScanner

| | |
|---|---|
| **Purpose** | Mock nutrition analysis from food photo |
| **State** | `fileName`, `previewUrl`, `loading`, `result`, `showOutput` |
| **Inputs** | Image file upload |
| **Outputs** | Calories, protein, carbs, fat cards |

Uses `NutritionResult` from `src/lib/types.ts`.

---

### Wiring a tool UI to routes

Register in `src/app/(tools)/tools/[slug]/page.tsx`:

```typescript
const toolComponents: Record<string, ComponentType<ToolUiProps>> = {
  "your-slug": YourToolComponent,
};
```

---

## Data Layer

### `constants.ts`

**Path:** `src/lib/constants.ts`

**Responsibilities:**

- `siteConfig` — name, tagline, URLs, contact email, brand colors
- `navLinks` — main navigation
- `socialLinks` — footer/social icons
- `toolCategories`, `appCategories` — filter/category lists

**Rule:** All site-wide config lives here—never hardcode in components.

---

### `types.ts`

**Path:** `src/lib/types.ts`

**Responsibilities:**

- All shared TypeScript interfaces (`App`, `Tool`, `BlogPost`, `ToolLayoutProps`, etc.)
- No inline prop interfaces in components (per project rules)

---

### `mdx.ts`

**Path:** `src/lib/mdx.ts`

**Responsibilities:**

- `getAllPosts()` — read and parse blog MDX with `'use cache'`
- `getPostBySlug(slug)` — single post with content
- `getAllTags()` — aggregate tags

Used by blog pages, sitemap, and `BlogTeaser`.

---

### `utils.ts`

**Path:** `src/lib/utils.ts`

**Responsibilities:**

- `cn()` — Tailwind class merging (`clsx` + `tailwind-merge`)
- `formatDate()` — display dates for blog UI
- `calculateReadingTime()`, `slugify()`, `truncate()` — content helpers

---

### Related files

| File | Role |
|------|------|
| `src/lib/schemas/contact.ts` | Zod schema for contact form |
| `src/lib/hosts.ts` | Multi-domain hostname helpers |
| `src/hooks/useDebounce.ts` | Debounced search (blog hub) |

---

## MS DevX Engineering Standards

### Strict TypeScript

- No `any`; no implicit types
- All interfaces in `src/lib/types.ts`
- Cast JSON imports: `import data from "…json"` → `as App[]` / `as Tool[]`

### Server-first architecture

- Server Components by default
- `"use client"` only for hooks, forms, animation, browser APIs
- Data loading in pages/layouts—pass props to components
- Blog/tools MDX and JSON read on the server

### Reusable components

| Folder | Use for |
|--------|---------|
| `components/ui/` | shadcn primitives only—do not modify |
| `components/shared/` | Cross-page reusable pieces |
| `components/sections/` | Page-level marketing sections |
| `components/tools/` | Tools ecosystem shell + UIs |
| `components/layout/` | NavBar, Footer |

### Accessibility

- Semantic HTML (`main`, `section`, `nav`, `label`)
- `aria-label` on icon-only buttons
- `focus-visible:ring-2` on interactive elements
- External links: `rel="noopener noreferrer"`

### Tailwind v4 conventions

- Design tokens in `globals.css` `@theme` block
- Use `text-navy`, `text-electric`, `bg-background`, etc.
- No hardcoded hex in JSX
- Responsive: mobile-first (`sm:`, `md:`, `lg:`)

### Next.js 16 requirements

- `await params` in dynamic routes (`params: Promise<{ slug: string }>`)
- `generateMetadata()` on pages
- `generateStaticParams()` for static blog/tool slugs
- `cacheComponents: true` + `'use cache'` on cached data functions
- Multi-domain: `src/middleware.ts` + `src/lib/hosts.ts`

### Content rules

- Marketing copy and structured data in `src/content/` (JSON + MDX)
- Never hardcode long content inside components

### Quality

- No `console.log` in committed code
- Complete features—no TODO placeholders in production paths
- `next/image` requires `width`, `height`, and `alt` when used

---

## Quick import reference

```tsx
// Layout
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

// Shared
import { SectionHeader } from "@/components/shared/SectionHeader";
import ThemeToggle from "@/components/shared/ThemeToggle";
import BackToTop from "@/components/shared/BackToTop";

// Tools
import ToolLayout from "@/components/tools/ToolLayout";
import CategoryFilter from "@/components/tools/CategoryFilter";

// Data
import { siteConfig, navLinks } from "@/lib/constants";
import type { App, Tool, BlogPost } from "@/lib/types";
import { getAllPosts } from "@/lib/mdx";
import { cn, formatDate } from "@/lib/utils";
```

---

For setup, deployment, and content workflows, see **[README.md](./README.md)**.
