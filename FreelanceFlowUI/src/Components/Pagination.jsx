import React from "react";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex justify-end items-center gap-2 mt-4 flex-wrap text-sm">
      {/* First */}
      <button
        onClick={() => onPageChange(1)}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-white border border-slate-300 hover:bg-slate-100"
        }`}
        disabled={currentPage === 1}
      >
        First
      </button>

      {/* Prev */}
      <button
        onClick={handlePrev}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-white border border-slate-300 hover:bg-slate-100"
        }`}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* Pages */}
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;

        if (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        ) {
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded border ${
                page === currentPage
                  ? "bg-indigo-600 text-white"
                  : "bg-white border-slate-300 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          );
        } else if (page === currentPage - 2 || page === currentPage + 2) {
          return <span key={page}>...</span>;
        }

        return null;
      })}

      {/* Next */}
      <button
        onClick={handleNext}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-white border border-slate-300 hover:bg-slate-100"
        }`}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

      {/* Last */}
      <button
        onClick={() => onPageChange(totalPages)}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-white border border-slate-300 hover:bg-slate-100"
        }`}
        disabled={currentPage === totalPages}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
