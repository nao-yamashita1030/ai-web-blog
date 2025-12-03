export function paginate<T>(
  items: T[],
  page: number,
  perPage: number
): { items: T[]; totalPages: number } {
  const totalPages = Math.ceil(items.length / perPage);
  const offset = (page - 1) * perPage;
  const paginatedItems = items.slice(offset, offset + perPage);

  return {
    items: paginatedItems,
    totalPages,
  };
}

export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxPages: number = 5
): number[] {
  const pages: number[] = [];

  if (totalPages <= maxPages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push(totalPages);
    }
  }

  return pages;
}

