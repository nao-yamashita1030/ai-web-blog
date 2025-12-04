import { getAllBlogs } from "@/lib/microcms";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";

// 開発環境ではキャッシュを無効化、本番環境では1時間ごとに再生成
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

export default async function Home() {
  const { contents: blogs, totalCount } = await getAllBlogs(100, 0);

  // デバッグ用（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    console.log(`[Home] 取得した記事数: ${blogs.length}, 総件数: ${totalCount}`);
    blogs.forEach((blog, index) => {
      console.log(`[Home] 記事${index + 1}: ${blog.title} (ID: ${blog.id})`);
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">最新記事</h1>
        {blogs.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              全{totalCount}件中 {blogs.length}件を表示
            </p>
            <ArticleList blogs={blogs} showPagination={false} />
          </>
        ) : (
          <p className="text-center text-gray-600">記事がありません</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
