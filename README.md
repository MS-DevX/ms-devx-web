# MS DevX

**Build smarter. Ship faster.**

MS DevX is a production-grade web platform for an indie AI studio. It combines a marketing and business website, a multi-domain tools ecosystem, a full MDX blog, and ten interactive AI-style utilities—built on **Next.js 16** with server-first architecture, partial prerendering, and Vercel deployment.

---

## 1. Project Overview

This repository powers:

| Surface | URL | Purpose |
|--------|-----|---------|
| **Main site** | [https://msdevx.com](https://msdevx.com) | Marketing, services, apps, blog, contact, hire |
| **Tools hub** | [https://tools.marth.systems](https://tools.marth.systems) | AI-powered utilities (same codebase, hostname routing) |

**Capabilities:**

- **Business website** — Home, services, apps, about, hire, contact
- **Tools ecosystem** — Hub, category UI, ten tool pages with mock AI UIs
- **Blog system** — MDX posts, static generation, SEO metadata
- **AI-powered utilities** — Client-side tools with simulated intelligence (ready for real APIs)
- **Next.js 16 architecture** — App Router, route groups `(main)` / `(tools)`, Cache Components, Turbopack

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | [React 19](https://react.dev) |
| Language | [TypeScript](https://www.typescriptlang.org) (strict) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (`@theme` tokens) |
| Components | [shadcn/ui](https://ui.shadcn.com) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Blog | MDX + [gray-matter](https://github.com/jonschlinkert/gray-matter) + [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) |
| Email | [Resend](https://resend.com) |
| Hosting | [Vercel](https://vercel.com) |

---

## 3. Local Development

### Prerequisites

- **Node.js** 20+ (22+ recommended for Resend SDK)
- **npm** 9+

### Commands

```bash
# Install dependencies
npm install

# Start development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the main site.

**Turbopack** is enabled by default via `next dev --turbopack` for faster local builds and hot reload.

### Optional: test tools domain locally

Add to your hosts file:

```
127.0.0.1 tools.localhost
```

Then visit [http://tools.localhost:3000](http://tools.localhost:3000) to preview tools-domain routing via `src/middleware.ts`.

### Other scripts

```bash
npm run build   # Production build
npm run start   # Start production server locally
npm run lint    # ESLint
```

---

## 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in values.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical main site URL (e.g. `https://msdevx.com`). Used in metadata, sitemap, and redirects. |
| `NEXT_PUBLIC_TOOLS_URL` | Yes | Tools subdomain URL (e.g. `https://tools.marth.systems`). |
| `RESEND_API_KEY` | For contact | API key from [Resend](https://resend.com). |
| `RESEND_FROM_EMAIL` | For contact | Verified sender (e.g. `MS DevX <hello@msdevx.com>`). |
| `CONTACT_EMAIL` | For contact | Inbox that receives form submissions. |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics 4 measurement ID. |
| `OPENAI_API_KEY` | Optional | Future AI integrations. |
| `ANTHROPIC_API_KEY` | Optional | Future Claude integrations. |
| `GOOGLE_AI_API_KEY` | Optional | Future Google AI integrations. |

Contact form submission fails gracefully with a configuration error if Resend variables are missing.

---

## 5. Project Structure

```
ms-devx/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (main)/          # Marketing site routes (msdevx.com)
│   │   ├── (tools)/         # Tools ecosystem layout + routes
│   │   ├── api/             # Route handlers (e.g. contact)
│   │   ├── layout.tsx       # Root layout, global metadata
│   │   ├── globals.css      # Tailwind v4 @theme design tokens
│   │   ├── sitemap.ts       # Dynamic sitemap
│   │   ├── robots.ts        # Crawler rules
│   │   ├── not-found.tsx    # Branded 404
│   │   └── opengraph-image.tsx
│   ├── components/
│   │   ├── layout/          # NavBar, Footer
│   │   ├── sections/        # Homepage & page sections
│   │   ├── shared/          # Reusable UI (SectionHeader, ThemeToggle, …)
│   │   ├── tools/           # ToolLayout, CategoryFilter, tool-uis/
│   │   └── ui/              # shadcn primitives (do not modify)
│   ├── content/
│   │   ├── blog/            # MDX blog posts
│   │   └── data/            # JSON data (apps, tools, services, …)
│   ├── hooks/               # Client hooks (e.g. useDebounce)
│   └── lib/                 # constants, types, mdx, utils, hosts, schemas
├── public/                  # Static assets
├── .env.example
├── vercel.json              # Security headers, caching, redirects
├── next.config.ts
└── middleware.ts            # Multi-domain hostname routing
```

### Folder responsibilities

| Path | Responsibility |
|------|----------------|
| `src/app/` | Routes, layouts, metadata, API routes, SEO files |
| `src/components/` | React UI; never fetch data—receive props from pages |
| `src/content/` | All site copy and structured data (JSON + MDX) |
| `src/lib/` | Shared logic: types, constants, MDX loaders, validation |
| `src/hooks/` | Reusable client hooks |

---

## 6. Adding a Blog Post

### Location

Create a new file in:

```
src/content/blog/your-post-slug.mdx
```

The filename (without `.mdx`) becomes the URL slug: `/blog/your-post-slug`.

### MDX format

Use standard MDX with YAML frontmatter at the top.

### Example frontmatter

```yaml
---
title: "Your Post Title"
date: "2026-05-30"
description: "A concise summary for SEO and cards."
tags: ["AI", "Next.js"]
author: "MS DevX"
coverImage: "/images/blog/your-cover.jpg"
readingTime: 5
featured: false
---

Your MDX content starts here. Use `##` headings, lists, and code blocks as needed.
```

### After adding a post

1. Place cover image in `public/images/blog/` if referenced.
2. Run `npm run build` — the post is picked up by `getAllPosts()` and added to the sitemap automatically.
3. Visit `/blog/your-post-slug` locally to verify.

---

## 7. Adding a New App

### Location

Edit:

```
src/content/data/apps.json
```

### Schema

Each app object must match the `App` interface in `src/lib/types.ts`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Display name |
| `description` | string | Yes | Short description |
| `category` | string | Yes | Category label |
| `iconUrl` | string | Yes | Path under `public/` |
| `playStoreUrl` | string | No | Google Play link |
| `webUrl` | string | No | Web product link |
| `badge` | `"Free" \| "AdMob" \| "Paid" \| "New"` | Yes | Badge label |
| `featured` | boolean | Yes | Show on homepage if `true` |

### Example entry

```json
{
  "id": "6",
  "name": "My New App",
  "description": "Short description of the app.",
  "category": "Productivity",
  "iconUrl": "/apps/my-new-app.png",
  "playStoreUrl": "https://play.google.com/store/apps/details?id=example",
  "webUrl": "https://example.com",
  "badge": "New",
  "featured": true
}
```

Featured apps appear on the homepage via `FeaturedApps`; all apps appear on `/apps`.

---

## 8. Adding a New Tool

### Overview

A new tool requires four coordinated updates:

1. **Data** — `src/content/data/tools.json`
2. **UI** — `src/components/tools/tool-uis/YourTool.tsx`
3. **Route map** — `src/app/(tools)/tools/[slug]/page.tsx`
4. **Optional** — category in `src/lib/constants.ts` (`toolCategories`)

### Step 1: Add to `tools.json`

```json
{
  "id": "11",
  "slug": "my-new-tool",
  "name": "My New Tool",
  "description": "What this tool does in one sentence.",
  "category": "AI",
  "icon": "Sparkles",
  "status": "live",
  "featured": false
}
```

| Field | Description |
|-------|-------------|
| `slug` | URL segment: `/tools/my-new-tool` (or clean path on tools subdomain) |
| `status` | `"live"` or `"coming-soon"` |
| `icon` | Lucide icon name (reference only in v1) |

### Step 2: Create tool UI component

Create a client component:

```
src/components/tools/tool-uis/MyNewTool.tsx
```

```tsx
"use client";

import type { ToolUiProps } from "@/lib/types";

export default function MyNewTool({ className }: ToolUiProps) {
  // useState, mock logic, shadcn UI — see existing tools for patterns
  return <div className={className}>…</div>;
}
```

### Step 3: Register in dynamic route

In `src/app/(tools)/tools/[slug]/page.tsx`, add to `toolComponents`:

```tsx
import MyNewTool from "@/components/tools/tool-uis/MyNewTool";

const toolComponents: Record<string, ComponentType<ToolUiProps>> = {
  // …existing entries
  "my-new-tool": MyNewTool,
};
```

`generateStaticParams()` reads from `tools.json` automatically—no change needed there.

### Step 4: Verify

```bash
npm run dev
```

- Main site: [http://localhost:3000/tools/my-new-tool](http://localhost:3000/tools/my-new-tool)
- Tools hub card links to the same path
- Sitemap includes the new URL after build

---

## 9. Updating Brand Colors

### Location

```
src/app/globals.css
```

Tailwind v4 uses the `@theme` block for design tokens.

### Primary brand colors

| Token | Hex | Tailwind class |
|-------|-----|----------------|
| Navy | `#0F1B2D` | `text-navy`, `bg-navy` |
| Electric Blue | `#4A9EFF` | `text-electric`, `bg-electric` |
| Sky | `#7BB8FF` | `text-sky` |
| Teal | `#1D9E75` | `text-teal` |
| Offwhite | `#F1EFE8` | background (light mode) |
| Ink | `#0A0A0A` | dark accents |

### Example change

```css
@theme {
  --color-electric: #4A9EFF;
  /* update token here */
}
```

Also update `siteConfig.colors` in `src/lib/constants.ts` for any JS references (OG image, emails).

**Rule:** Do not hardcode hex values in JSX—use Tailwind utility classes.

---

## 10. Deployment

### Platform

Deploy to **[Vercel](https://vercel.com)** connected to this repository.

### Domains

| Domain | Serves |
|--------|--------|
| `msdevx.com` | Main marketing site `(main)` |
| `www.msdevx.com` | Redirects to apex (via `vercel.json`) |
| `tools.marth.systems` | Tools ecosystem (middleware rewrites) |

### Deployment checklist

- [ ] Connect Git repository to Vercel
- [ ] Set environment variables from `.env.example`
- [ ] Add all three domains in Vercel → Project → Domains
- [ ] Verify DNS for `msdevx.com` and `tools.marth.systems`
- [ ] Confirm Resend domain/sender is verified
- [ ] Run production build locally: `npm run build`
- [ ] Deploy and test `/`, `/blog`, `/tools`, `/contact`
- [ ] Submit `https://msdevx.com/sitemap.xml` to Google Search Console
- [ ] Test Open Graph: `https://msdevx.com/opengraph-image`
- [ ] Test contact form end-to-end on production

### Multi-domain routing

Hostname detection lives in `src/middleware.ts` and `src/lib/hosts.ts`. No duplicate app code is required—both domains run the same deployment.

---

## 11. Troubleshooting

### MDX errors

- **Invalid frontmatter** — Ensure `---` delimiters and valid YAML; dates as `"YYYY-MM-DD"` strings.
- **Build fails on post** — Check for unclosed JSX or invalid MDX syntax; test with a minimal post first.
- **Post missing** — Filename must end in `.mdx` and live in `src/content/blog/`.

### Turbopack cache issues

```bash
# Remove Next.js cache and restart
rm -rf .next
npm run dev
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### Build failures

- Run `npm run build` locally and read the full TypeScript error.
- Ensure all tool slugs in `tools.json` have a matching entry in `toolComponents`.
- Verify `'use cache'` MDX functions align with `cacheComponents: true` in `next.config.ts`.

### Missing environment variables

- Contact API returns 500 with “Email service is not configured” — set `RESEND_*` and `CONTACT_EMAIL`.
- Wrong canonical URLs — set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_TOOLS_URL`.

### Tools domain not routing

- Confirm `tools.marth.systems` is assigned in Vercel.
- Test locally with `tools.localhost` and hosts file entry.
- Check `src/middleware.ts` matcher is not excluding your path.

---

## 12. License

**Proprietary © MS DevX**

All rights reserved. This codebase is not licensed for redistribution or commercial use without explicit permission from MS DevX.

---

## Project Status

| | |
|---|---|
| **Version** | 1.0 |
| **Status** | Production Ready |

The platform includes marketing pages, tools ecosystem, blog, contact API, SEO infrastructure, multi-domain support, and ten interactive tool UIs—ready for production deployment on Vercel.

For component-level documentation, see **[COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)**.
