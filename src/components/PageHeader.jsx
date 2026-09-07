export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h1>
        <span
          className="block h-[3px] w-12 origin-left rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] mt-1.5 mb-2.5"
          style={{ animation: "growLine 500ms ease-out" }}
        />
        <p className="text-[14px] font-medium text-neutral-500 dark:text-neutral-400">{subtitle}</p>
        <span
          className="block h-[2px] w-34 rounded-full mt-2 bg-gradient-to-r from-transparent via-[#38BDF8] dark:via-[#38BDF8] to-transparent"
          style={{ backgroundSize: "200% 100%", animation: "shimmerLine 2.5s linear infinite" }}
        />
      </div>
      {action}
    </div>
  );
}
