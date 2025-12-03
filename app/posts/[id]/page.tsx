import { notFound } from "next/navigation";
import { getBlogById, getAllBlogs } from "@/lib/microcms";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownContent from "@/components/MarkdownContent";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: 1時間ごとに再生成

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const { contents } = await getAllBlogs(100, 0);
  return contents.map((blog) => ({
    id: blog.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlogById(id).catch(() => null);

  if (!blog) {
    return {
      title: "記事が見つかりません",
    };
  }

  return {
    title: blog.title,
    description: blog.content.substring(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.content.substring(0, 160),
      images: blog.eyecatch ? [blog.eyecatch.url] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const blog = await getBlogById(id).catch(() => null);

  if (!blog || !blog.publishedAt) {
    notFound();
  }

  const publishedDate = new Date(blog.publishedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        <article>
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center gap-4 mb-6 text-gray-600">
            {publishedDate && <time>{publishedDate}</time>}
            {blog.category && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {blog.category.name}
              </span>
            )}
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          {blog.eyecatch && (
            <div className="relative w-full h-64 mb-8">
              <Image
                src={blog.eyecatch.url}
                alt={blog.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <div className="prose prose-lg max-w-none">
            <MarkdownContent content={blog.content} />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

