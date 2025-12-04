import { createClient } from "microcms-js-sdk";
import type { Blog, Category, Tag } from "@/types/blog";

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  console.warn(
    "MICROCMS_SERVICE_DOMAIN or MICROCMS_API_KEY is not set. Please set them in .env.local"
  );
}

export const client = serviceDomain && apiKey
  ? createClient({
      serviceDomain,
      apiKey,
    })
  : null;

export async function getAllBlogs(
  limit = 10,
  offset = 0
): Promise<{ contents: Blog[]; totalCount: number }> {
  if (!client) {
    return { contents: [], totalCount: 0 };
  }
  const data = await client.get({
    endpoint: "blogs",
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

export async function getBlogById(id: string): Promise<Blog | null> {
  if (!client) {
    return null;
  }
  try {
    const data = await client.get({
      endpoint: "blogs",
      contentId: id,
    });
    return data as Blog;
  } catch (error) {
    return null;
  }
}

export async function getBlogsByCategory(
  categorySlug: string,
  limit = 10,
  offset = 0
): Promise<{ contents: Blog[]; totalCount: number }> {
  if (!client) {
    return { contents: [], totalCount: 0 };
  }
  const data = await client.get({
    endpoint: "blogs",
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
  if (!client) {
    return { contents: [], totalCount: 0 };
  }
  const data = await client.get({
    endpoint: "blogs",
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
  if (!client) {
    return [];
  }
  const data = await client.get({
    endpoint: "categories",
  });
  return data.contents as Category[];
}

export async function getAllTags(): Promise<Tag[]> {
  if (!client) {
    return [];
  }
  try {
    const data = await client.get({
      endpoint: "tags",
    });
    return data.contents as Tag[];
  } catch (error) {
    // タグエンドポイントが存在しない場合は空配列を返す
    console.warn('Tags endpoint not found, returning empty array');
    return [];
  }
}

