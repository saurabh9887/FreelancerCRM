import React from "react";

const Pagination = ({
  currentPage = 12,
  totalPages = 20,
  onPageChange = () => {},
}) => {
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
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-white border border-slate-300 hover:bg-slate-100"
        }`}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* First visible page */}
      <button className="px-3 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100">
        1
      </button>

      {/* Ellipsis */}
      <span className="px-2">...</span>

      {/* Middle pages */}
      {[10, 11, 12, 13, 14].map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page === 14}
          className={`px-3 py-1 rounded border ${
            page === currentPage
              ? "bg-indigo-600 text-white"
              : page === 14
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-white border-slate-300 hover:bg-slate-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Ellipsis */}
      <span className="px-2">...</span>

      {/* Last page */}
      <button className="px-3 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100">
        20
      </button>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
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
