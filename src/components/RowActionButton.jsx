const VARIANTS = {
  view: {
    icon: "M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z|M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.147.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
    hover: "hover:bg-[#0284C7]/10 dark:hover:bg-[#0EA5E9]/15 hover:text-[#0284C7] dark:hover:text-[#38BDF8]",
  },
  edit: {
    icon: "M13.586 3.586a2 2 0 112.828 2.828l-8.5 8.5a2 2 0 01-.708.464L4 16l.622-3.206a2 2 0 01.464-.708l8.5-8.5z",
    hover: "hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400",
  },
};

export default function RowActionButton({ variant, label, onClick }) {
  const v = VARIANTS[variant];
  const paths = v.icon.split("|");

  return (
    <button
      onClick={onClick}
      className={`group/btn inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-neutral-600 dark:text-neutral-300 transition-all duration-200 hover:scale-[1.04] active:scale-95 ${v.hover}`}
    >
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:rotate-[8deg]"
      >
        {paths.map((d, i) => (
          <path key={i} fillRule="evenodd" clipRule="evenodd" d={d} />
        ))}
      </svg>
      {label}
    </button>
  );
}
