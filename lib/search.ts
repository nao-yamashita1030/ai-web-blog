import type { Blog } from "@/types/blog";

export function searchBlogs(blogs: Blog[], query: string): Blog[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();

  return blogs.filter((blog) => {
    const titleMatch = blog.title.toLowerCase().includes(normalizedQuery);
    const contentMatch = blog.content.toLowerCase().includes(normalizedQuery);
    const categoryMatch = blog.category?.name.toLowerCase().includes(normalizedQuery);
    const tagMatch = blog.tags?.some((tag) =>
      tag.name.toLowerCase().includes(normalizedQuery)
    );

    return titleMatch || contentMatch || categoryMatch || tagMatch;
  });
}

export function filterByCategory(blogs: Blog[], categorySlug: string): Blog[] {
  return blogs.filter(
    (blog) => blog.category?.slug === categorySlug
  );
}

export function filterByTag(blogs: Blog[], tagSlug: string): Blog[] {
  return blogs.filter((blog) =>
    blog.tags?.some((tag) => tag.slug === tagSlug)
  );
}

