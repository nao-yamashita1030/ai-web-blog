import type { Blog } from "@/types/blog";
import ArticleCard from "./ArticleCard";
import Pagination from "./Pagination";

type ArticleListProps = {
  blogs: Blog[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
};

export default function ArticleList({
  blogs,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPagination = true,
}: ArticleListProps) {
  // デバッグ用（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    console.log(`[ArticleList] 表示する記事数: ${blogs.length}`);
    if (blogs.length > 0) {
      blogs.forEach((blog, index) => {
        console.log(`[ArticleList] 記事${index + 1}: ${blog.title} (ID: ${blog.id})`);
      });
    } else {
      console.warn("[ArticleList] 記事が0件です");
    }
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        <p>記事がありません</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <ArticleCard key={blog.id} blog={blog} />
        ))}
      </div>
      {showPagination && totalPages > 1 && onPageChange && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}


