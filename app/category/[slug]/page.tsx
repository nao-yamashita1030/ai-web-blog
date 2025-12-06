import { notFound } from "next/navigation";
import { getBlogsByCategory, getAllCategories } from "@/lib/microcms";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";

export const revalidate = 3600; // ISR: 1時間ごとに再生成

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const { contents: blogs } = await getBlogsByCategory(slug);

  if (blogs.length === 0) {
    notFound();
  }

  const categoryName = blogs[0]?.category?.name || "カテゴリ";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">カテゴリ: {categoryName}</h1>
        <ArticleList blogs={blogs} showPagination={false} />
      </main>
      <Footer />
    </div>
  );
}




