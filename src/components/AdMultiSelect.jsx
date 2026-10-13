import { useEffect, useMemo, useRef, useState } from "react";

function ChevronIcon({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Box({ active }) {
  return (
    <span
      className={`h-4 w-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
        active
          ? "bg-[#0284C7] dark:bg-[#0EA5E9] border-[#0284C7] dark:border-[#0EA5E9] text-white"
          : "border-neutral-300 dark:border-neutral-600"
      }`}
    >
      {active && <CheckIcon />}
    </span>
  );
}

/** options: [{ id, label }]   selected: array of ids */
export default function AdMultiSelect({ label, options, selected, onChange, placeholder = "Select…", maxChips = 3 }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const visible = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())),
    [options, q]
  );
  const chosen = options.filter((o) => selected.includes(o.id));
  const allChecked = visible.length > 0 && visible.every((o) => selected.includes(o.id));

  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]);
  const toggleAll = () => {
    const ids = visible.map((o) => o.id);
    onChange(allChecked ? selected.filter((v) => !ids.includes(v)) : [...new Set([...selected, ...ids])]);
  };

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
          {label} <span className="font-normal text-neutral-400 dark:text-neutral-500">({selected.length} selected)</span>
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between rounded-lg border bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium transition-colors ${
          open
            ? "border-[#0284C7] dark:border-[#0EA5E9]"
            : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
        }`}
      >
        <span className="flex flex-wrap gap-1 items-center text-left">
          {chosen.length === 0 ? (
            <span className="text-neutral-400 dark:text-neutral-500">{placeholder}</span>
          ) : (
            <>
              {chosen.slice(0, maxChips).map((s) => (
                <span
                  key={s.id}
                  className="rounded-full bg-[#0284C7]/10 dark:bg-[#0EA5E9]/10 text-[#0284C7] dark:text-[#0EA5E9] text-[11px] font-semibold px-2 py-0.5"
                >
                  {s.label}
                </span>
              ))}
              {chosen.length > maxChips && (
                <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                  +{chosen.length - maxChips} more
                </span>
              )}
            </>
          )}
        </span>
        <span className="text-neutral-400 shrink-0 ml-2">
          <ChevronIcon open={open} />
        </span>
      </button>

      <div
        className={`absolute z-20 mt-1.5 w-full origin-top rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] shadow-lg overflow-hidden transition-all duration-150 ease-out ${
          open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="p-2 border-b border-neutral-100 dark:border-neutral-800">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-[13px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] transition-colors"
          />
        </div>

        <div className="max-h-60 overflow-y-auto">
          {visible.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="w-full flex items-center gap-2.5 text-left px-3.5 py-2.5 text-[13px] font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
            >
              <Box active={allChecked} />
              Select all{q ? " (filtered)" : ""}
            </button>
          )}

          {visible.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              className="w-full flex items-center gap-2.5 text-left px-3.5 py-2.5 text-[13px] font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
            >
              <Box active={selected.includes(o.id)} />
              <span className="truncate">{o.label}</span>
            </button>
          ))}

          {visible.length === 0 && <div className="px-3.5 py-4 text-[13px] font-medium text-neutral-400">No results</div>}
        </div>

        <div className="flex justify-between px-3.5 py-2 border-t border-neutral-100 dark:border-neutral-800">
          <button type="button" onClick={() => onChange([])} className="text-[12px] font-semibold text-red-500">
            Clear all
          </button>
          <button type="button" onClick={() => setOpen(false)} className="text-[12px] font-semibold text-[#0284C7] dark:text-[#0EA5E9]">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}