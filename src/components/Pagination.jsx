export default function Pagination({ page, totalPages, onPageChange, rangeStart, rangeEnd, totalItems, itemLabel = "items" }) {
  const goTo = (p) => onPageChange(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-neutral-100 dark:border-neutral-800 flex-wrap">
      <span className="text-[12px] font-medium text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
        Showing {rangeStart} to {rangeEnd} of {totalItems} {itemLabel}
      </span>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo(1)}
            disabled={page === 1}
            title="First page"
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-700 h-9 px-3 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path
                fillRule="evenodd"
                d="M10.79 5.23a.75.75 0 01-.02 1.06L6.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02zm5 0a.75.75 0 01-.02 1.06L11.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 h-9 px-3.5 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
            Prev
          </button>

          <span className="inline-flex items-center h-9 px-3.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[13px] font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 h-9 px-3.5 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Next
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            onClick={() => goTo(totalPages)}
            disabled={page === totalPages}
            title="Last page"
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-700 h-9 px-3 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path
                fillRule="evenodd"
                d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02zm5 0a.75.75 0 01.02-1.06L13.168 10 9.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}