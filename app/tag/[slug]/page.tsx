import { notFound } from "next/navigation";
import { getBlogsByTag, getAllTags } from "@/lib/microcms";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";

export const revalidate = 3600; // ISR: 1時間ごとに再生成

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const { contents: blogs } = await getBlogsByTag(slug);

  if (blogs.length === 0) {
    notFound();
  }

  const tagName = blogs[0]?.tags?.find((tag) => tag.slug === slug)?.name || "タグ";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">タグ: {tagName}</h1>
        <ArticleList blogs={blogs} showPagination={false} />
      </main>
      <Footer />
    </div>
  );
}


