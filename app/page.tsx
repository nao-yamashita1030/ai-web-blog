import { getAllBlogs } from "@/lib/microcms";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";

export const revalidate = 3600; // ISR: 1時間ごとに再生成

export default async function Home() {
  const { contents: blogs, totalCount } = await getAllBlogs(10, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">最新記事</h1>
        {blogs.length > 0 ? (
          <ArticleList blogs={blogs} showPagination={false} />
        ) : (
          <p className="text-center text-gray-600">記事がありません</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
