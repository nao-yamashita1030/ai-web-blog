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


