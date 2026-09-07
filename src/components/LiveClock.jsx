import { useEffect, useState } from "react";

export default function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="flex items-center gap-2.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-4 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
      <span className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
        {date}
      </span>
      <span className="h-3 w-px bg-neutral-300 dark:bg-neutral-600" />
      <span className="text-[13px] font-bold text-[#0284C7] dark:text-[#38BDF8] tabular-nums whitespace-nowrap">
        {time}
      </span>
    </div>
  );
}
