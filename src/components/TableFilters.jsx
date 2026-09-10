/**
 * Small, reusable inline filter inputs meant to sit inside a dedicated
 * "filter row" right under a table header row. No popups — the input
 * is always visible and responsive (scrolls with the table on small screens).
 *
 * Usage (inside a <tr> of plain <td> cells, one per column):
 *
 * <tr className="bg-neutral-50 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800">
 *   <td className="px-5 py-2"></td>
 *   <td className="px-5 py-2">
 *     <FilterTextInput
 *       placeholder="Search channel…"
 *       value={filters.channel_name}
 *       onChange={(v) => setFilters((f) => ({ ...f, channel_name: v }))}
 *     />
 *   </td>
 *   <td className="px-5 py-2">
 *     <FilterNumberInput
 *       placeholder="LCN"
 *       value={filters.lcn}
 *       onChange={(v) => setFilters((f) => ({ ...f, lcn: v }))}
 *     />
 *   </td>
 *   <td className="px-5 py-2">
 *     <FilterSelect
 *       value={filters.genre_id}
 *       onChange={(v) => setFilters((f) => ({ ...f, genre_id: v }))}
 *       options={genres.map((g) => ({ value: g.id, label: g.name }))}
 *       allLabel="All genres"
 *     />
 *   </td>
 *   <td className="px-5 py-2">
 *     <FilterSelect
 *       value={filters.status}
 *       onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
 *       options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
 *       allLabel="All status"
 *     />
 *   </td>
 *   <td className="px-5 py-2"></td>
 *   <td className="px-5 py-2"></td>
 * </tr>
 */

const inputBase =
  "w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] px-2 py-1 text-[12px] font-medium text-neutral-700 dark:text-neutral-200 outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] transition-colors";

export function FilterTextInput({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative">
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputBase} ${value ? "pr-6 border-[#0284C7] dark:border-[#0EA5E9]" : ""}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          title="Clear"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 flex items-center justify-center rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function FilterSelect({ value, onChange, options = [], allLabel = "All" }) {
  return (
    <div className="relative">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} appearance-none cursor-pointer pr-6 ${value ? "pr-10 border-[#0284C7] dark:border-[#0EA5E9]" : ""}`}
      >
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          title="Clear"
          className="absolute right-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 flex items-center justify-center rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

export function FilterNumberInput({ value, onChange, placeholder = "LCN" }) {
  const active = value !== "" && value != null;
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="numeric"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputBase} text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
          active ? "pr-6 border-[#0284C7] dark:border-[#0EA5E9]" : ""
        }`}
      />
      {active && (
        <button
          type="button"
          onClick={() => onChange("")}
          title="Clear"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 flex items-center justify-center rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function FilterRangeInput({ value, onChange, minPlaceholder = "Min", maxPlaceholder = "Max" }) {
  const v = value || { min: "", max: "" };
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={v.min}
        onChange={(e) => onChange({ ...v, min: e.target.value })}
        placeholder={minPlaceholder}
        className={`${inputBase} ${v.min !== "" ? "border-[#0284C7] dark:border-[#0EA5E9]" : ""}`}
      />
      <input
        type="number"
        value={v.max}
        onChange={(e) => onChange({ ...v, max: e.target.value })}
        placeholder={maxPlaceholder}
        className={`${inputBase} ${v.max !== "" ? "border-[#0284C7] dark:border-[#0EA5E9]" : ""}`}
      />
    </div>
  );
}