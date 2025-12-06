import { getAllBlogs } from "@/lib/microcms";
import { searchBlogs } from "@/lib/search";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";

export const revalidate = 3600; // ISR: 1時間ごとに再生成

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const { contents: allBlogs } = await getAllBlogs(100, 0);

  const query = q || "";
  const searchResults = query ? searchBlogs(allBlogs, query) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">
          検索結果: {query ? `"${query}"` : "検索キーワードを入力してください"}
        </h1>
        {query ? (
          searchResults.length > 0 ? (
            <ArticleList blogs={searchResults} showPagination={false} />
          ) : (
            <p className="text-center text-gray-600">
              検索結果が見つかりませんでした
            </p>
          )
        ) : (
          <p className="text-center text-gray-600">
            検索キーワードを入力してください
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}




