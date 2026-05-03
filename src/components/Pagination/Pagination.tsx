import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPages = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 5) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
  };

  const pages = getPages();

  return (
    <div className="flex items-center gap-2 mt-4 justify-center">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium text-sm dark:text-white dark:hover:bg-gray-50/10"
      >
        Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-1 text-sm text-gray-400 dark:text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-1 border rounded-lg text-sm font-bold transition-all ${
                currentPage === page
                  ? "bg-blue-900 border-none text-white shadow-md"
                  : "hover:bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:text-white transition-colors font-medium text-sm dark:hover:bg-gray-50/10"
      >
        Next
      </button>
    </div>
  );
};