import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * Reusable toast notifications for every page.
 *
 * 1) Wrap the app once:   <ToastProvider><App /></ToastProvider>
 * 2) Use it anywhere:     const toast = useToast();
 *                         toast.success("Advertisement added successfully");
 *                         toast.error("Save failed");
 *                         toast.info("Something happened");
 */

const ToastContext = createContext(null);

const STYLES = {
  success: {
    ring: "border-emerald-200 dark:border-emerald-500/30",
    icon: "bg-emerald-500",
    bar: "bg-emerald-500",
    title: "Success",
    path: "M20 6 9 17l-5-5",
  },
  error: {
    ring: "border-red-200 dark:border-red-500/30",
    icon: "bg-red-500",
    bar: "bg-red-500",
    title: "Error",
    path: "M18 6 6 18M6 6l12 12",
  },
  info: {
    ring: "border-sky-200 dark:border-sky-500/30",
    icon: "bg-[#0284C7]",
    bar: "bg-[#0284C7]",
    title: "Info",
    path: "M12 8h.01M11 12h1v4h1",
  },
};

function ToastItem({ toast, onClose }) {
  const s = STYLES[toast.type] || STYLES.info;

  return (
    <div
      role="status"
      className={`relative w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border ${s.ring} bg-white dark:bg-[#0F1729] shadow-xl`}
      style={{ animation: "toastIn 260ms cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <span className={`mt-0.5 h-6 w-6 shrink-0 rounded-full ${s.icon} flex items-center justify-center text-white`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d={s.path} />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold text-neutral-900 dark:text-white">{s.title}</div>
          <div className="text-[13px] font-medium text-neutral-600 dark:text-neutral-300 break-words">
            {toast.message}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          title="Dismiss"
          className="h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* auto-dismiss progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-[3px] ${s.bar}`}
        style={{ animation: `toastBar ${toast.duration}ms linear forwards` }}
      />
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message, duration = 3500) => {
      const id = ++idRef.current;
      setToasts((list) => [...list.slice(-3), { id, type, message, duration }]); // keep max 4
      timers.current[id] = setTimeout(() => remove(id), duration);
      return id;
    },
    [remove]
  );

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  const api = useMemo(
    () => ({
      success: (msg, duration) => push("success", msg, duration),
      error: (msg, duration) => push("error", msg, duration ?? 5000),
      info: (msg, duration) => push("info", msg, duration),
      dismiss: remove,
    }),
    [push, remove]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      <style>{`
        @keyframes toastIn { from { opacity: 0; transform: translateX(24px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes toastBar { from { width: 100% } to { width: 0% } }
      `}</style>

      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onClose={() => remove(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export default ToastProvider;