import Link from "next/link";
import Image from "next/image";
import type { Blog } from "@/types/blog";

type ArticleCardProps = {
  blog: Blog;
};

export default function ArticleCard({ blog }: ArticleCardProps) {
  const publishedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/posts/${blog.id}`}>
        {blog.eyecatch && (
          <div className="relative w-full h-48">
            <Image
              src={blog.eyecatch.url}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h2>
          {publishedDate && (
            <time className="text-sm text-gray-600">{publishedDate}</time>
          )}
          {blog.category && (
            <div className="mt-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {blog.category.name}
              </span>
            </div>
          )}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {blog.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

