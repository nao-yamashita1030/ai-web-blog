import { createClient } from "microcms-js-sdk";
import type { Blog, Category, Tag } from "@/types/blog";

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is not set");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is not set");
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

export async function getAllBlogs(
  limit = 10,
  offset = 0
): Promise<{ contents: Blog[]; totalCount: number }> {
  const data = await client.get({
    endpoint: "blog",
    queries: {
      limit,
      offset,
      orders: "-publishedAt",
    },
  });
  return {
    contents: data.contents as Blog[],
    totalCount: data.totalCount,
  };
}

export async function getBlogById(id: string): Promise<Blog> {
  const data = await client.get({
    endpoint: "blog",
    contentId: id,
  });
  return data as Blog;
}

export async function getBlogsByCategory(
  categorySlug: string,
  limit = 10,
  offset = 0
): Promise<{ contents: Blog[]; totalCount: number }> {
  const data = await client.get({
    endpoint: "blog",
    queries: {
      limit,
      offset,
      filters: `category[equals]${categorySlug}`,
      orders: "-publishedAt",
    },
  });
  return {
    contents: data.contents as Blog[],
    totalCount: data.totalCount,
  };
}

export async function getBlogsByTag(
  tagSlug: string,
  limit = 10,
  offset = 0
): Promise<{ contents: Blog[]; totalCount: number }> {
  const data = await client.get({
    endpoint: "blog",
    queries: {
      limit,
      offset,
      filters: `tags[contains]${tagSlug}`,
      orders: "-publishedAt",
    },
  });
  return {
    contents: data.contents as Blog[],
    totalCount: data.totalCount,
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const data = await client.get({
    endpoint: "category",
  });
  return data.contents as Category[];
}

export async function getAllTags(): Promise<Tag[]> {
  const data = await client.get({
    endpoint: "tag",
  });
  return data.contents as Tag[];
}

