import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

import type { BlogPost } from "@/lib/types";

const POSTS_PATH = path.join(process.cwd(), "src/content/blog");

export async function getAllPosts(): Promise<BlogPost[]> {
  "use cache";

  const files = await fs.readdir(POSTS_PATH);

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const filePath = path.join(POSTS_PATH, file);

        const source = await fs.readFile(filePath, "utf-8");

        const { data } = matter(source);

        return {
          slug: file.replace(".mdx", ""),
          title: data.title,
          date: data.date,
          description: data.description,
          tags: data.tags || [],
          author: data.author,
          coverImage: data.coverImage,
          readingTime: data.readingTime,
          featured: data.featured || false,
        } as BlogPost;
      })
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  "use cache";

  try {
    const filePath = path.join(POSTS_PATH, `${slug}.mdx`);

    const source = await fs.readFile(filePath, "utf-8");

    const { data, content } = matter(source);

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      tags: data.tags || [],
      author: data.author,
      coverImage: data.coverImage,
      readingTime: data.readingTime,
      featured: data.featured || false,
      content,
    };
  } catch {
    return null;
  }
}

export async function getAllTags(): Promise<string[]> {
  "use cache";

  const posts = await getAllPosts();

  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}
