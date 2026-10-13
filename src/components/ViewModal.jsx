import ModalCloseButton from "./ModalCloseButton.jsx";
export default function ViewModal({ title, subtitle, images = [], fields = [], onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        style={{ animation: "fadeIn 180ms ease-out" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-[#0F1729] border border-neutral-200 dark:border-neutral-700"
        style={{ animation: "popIn 200ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes popIn { from { opacity: 0; transform: scale(0.96) translateY(8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
        `}</style>

        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-[17px] font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h2>
            {subtitle && (
              <p className="text-[12px] font-medium text-neutral-400 dark:text-neutral-500 mt-0.5">{subtitle}</p>
            )}
          </div>
         <ModalCloseButton onClick={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {images.length > 0 && (
            <div className={`grid gap-3 ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {images.map((img, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 aspect-video overflow-hidden flex items-center justify-center"
                >
                  {img.src ? (
                    <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[11px] font-medium text-neutral-400">No {img.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-0.5">
            {fields.map((f) => (
              <div
                key={f.label}
                className="flex items-start justify-between gap-4 py-2.5 border-b border-neutral-50 dark:border-neutral-800/60 last:border-0"
              >
                <span className="text-[12px] font-semibold text-neutral-400 dark:text-neutral-500 shrink-0">
                  {f.label}
                </span>
                <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100 text-right break-words">
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {onEdit && (
          <div className="px-6 py-5 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={onEdit}
              className="w-full rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold py-2.5 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
