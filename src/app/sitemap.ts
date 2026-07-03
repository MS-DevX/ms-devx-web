import type { MetadataRoute } from "next";

import toolsData from "@/content/data/tools.json";
import { siteConfig } from "@/lib/constants";
import { getAllPosts } from "@/lib/mdx";
import { absoluteUrl, toolsPublicPath } from "@/lib/seo";
import type { Tool } from "@/lib/types";

const tools = toolsData as Tool[];

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: siteConfig.siteUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${siteConfig.siteUrl}/services`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${siteConfig.siteUrl}/apps`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${siteConfig.siteUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${siteConfig.siteUrl}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${siteConfig.siteUrl}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${siteConfig.siteUrl}/hire`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    url: `${siteConfig.siteUrl}/privacy`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${siteConfig.siteUrl}/syncdue-privacy`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${siteConfig.siteUrl}/mc-privacy`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${siteConfig.siteUrl}/tools`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: siteConfig.toolsUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const toolRoutesMain: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteConfig.siteUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const toolRoutesSubdomain: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: absoluteUrl(toolsPublicPath(tool.slug), "tools"),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...toolRoutesMain,
    ...toolRoutesSubdomain,
  ];
}
