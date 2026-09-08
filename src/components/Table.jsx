/** Rounded card wrapper + horizontal scroll container for any data table. */
export function TableCard({ children, minWidth = "min-w-[640px]" }) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] overflow-hidden">
      <div className="overflow-x-auto">
        <table className={`w-full text-[13px] ${minWidth}`}>{children}</table>
      </div>
    </div>
  );
}

/** Gradient header row — wrap your <Th> cells with this inside <thead>. */
export function TableHeaderRow({ children }) {
  return (
    <thead>
      <tr className="bg-gradient-to-r from-[#0284C7] to-[#38BDF8] dark:from-[#0369A1] dark:to-[#0EA5E9] text-left">
        {children}
      </tr>
    </thead>
  );
}

/** Single header cell, optionally with a leading icon (pass any <svg>...</svg> element),
 * right alignment, and click-to-sort behaviour.
 * Pass `sortDirection` ("asc" | "desc" | null) + `onSort` to make it sortable.
 */
export function Th({ children, icon, align = "left", width, sortDirection, onSort }) {
  const sortable = typeof onSort === "function";
  const content = (
    <span className={`inline-flex items-center gap-1.5 ${align === "right" ? "justify-end" : ""}`}>
      {icon}
      {children}
      {sortable && (
        <span className="inline-flex flex-col -space-y-1 ml-0.5">
          <svg
            viewBox="0 0 12 8"
            fill="currentColor"
            className={`h-2 w-2.5 ${sortDirection === "asc" ? "opacity-100" : "opacity-40"}`}
          >
            <path d="M6 0l6 6H0z" />
          </svg>
          <svg
            viewBox="0 0 12 8"
            fill="currentColor"
            className={`h-2 w-2.5 ${sortDirection === "desc" ? "opacity-100" : "opacity-40"}`}
          >
            <path d="M6 8L0 2h12z" />
          </svg>
        </span>
      )}
    </span>
  );

  return (
    <th className={`px-5 py-3.5 font-bold text-white ${width || ""} ${align === "right" ? "text-right" : ""}`}>
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="inline-flex items-center hover:opacity-80 transition-opacity select-none"
        >
          {content}
        </button>
      ) : (
        content
      )}
    </th>
  );
}

/** Zebra-striped, hoverable data row. */
export function Tr({ index, children, className = "" }) {
  return (
    <tr
      className={`group transition-colors ${
        index % 2 === 0 ? "bg-white dark:bg-[#0F1729]" : "bg-[#F0F9FF] dark:bg-neutral-800/40"
      } hover:bg-[#E0F2FE] dark:hover:bg-neutral-800/70 ${className}`}
    >
      {children}
    </tr>
  );
}

/** Empty-state row spanning the full table width. */
export function EmptyState({ colSpan, title, subtitle, actionLabel, onAction }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-16 text-center">
        <div className="text-[14px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">{title}</div>
        {subtitle && (
          <div className="text-[13px] font-medium text-neutral-400 dark:text-neutral-500 mb-4">{subtitle}</div>
        )}
        {actionLabel && (
          <button
            onClick={onAction}
            className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            {actionLabel}
          </button>
        )}
      </td>
    </tr>
  );
}