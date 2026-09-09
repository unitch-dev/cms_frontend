import { useEffect, useRef, useState } from "react";

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

export default function SelectDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
          {label}
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
        <span className="capitalize text-neutral-800 dark:text-neutral-100">
          {current ? current.label : "Select…"}
        </span>
        <span className="text-neutral-400">
          <ChevronIcon open={open} />
        </span>
      </button>

      <div
        className={`absolute z-20 mt-1.5 w-full origin-top rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] shadow-lg overflow-hidden transition-all duration-150 ease-out ${
          open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => {
              onChange(o.value);
              setOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 text-[13px] font-medium capitalize transition-colors ${
              o.value === value
                ? "bg-[#0284C7]/10 dark:bg-[#0EA5E9]/10 text-[#0284C7] dark:text-[#0EA5E9]"
                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}