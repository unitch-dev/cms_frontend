import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getChannels } from "../api/channels";
import { getPopularChannels } from "../api/popularChannels";
import { getGenres } from "../api/genres";
import { getBanners } from "../api/banners";
import { getAdvertisements } from "../api/advertisements";
import { useTheme } from "../context/ThemeContext.jsx";

const CARD_META = [
  {
    key: "channels",
    label: "Channels",
    sub: "Total channels",
    color: "#3B82F6",
    icon: "M4 5h16v3H4V5zm0 5h10v9H4v-9zm12 0h4v5h-4v-5zm0 6h4v3h-4v-3z",
  },
  {
    key: "popularChannels",
    label: "Popular Channels",
    sub: "Most watched",
    color: "#EC4899",
    icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.98 20.94a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  },
  {
    key: "genres",
    label: "Genres",
    sub: "Available genres",
    color: "#8B5CF6",
    icon: "M4 5a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm9 0a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-5a1 1 0 01-1-1V5zM4 14a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5zm9 0a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5z",
  },
  {
    key: "banners",
    label: "Banners",
    sub: "Active banners",
    color: "#10B981",
    icon: "M3 4a1 1 0 011-1h16a1 1 0 011 1v3H3V4zm0 5h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9zm3 3v2h6v-2H6z",
  },
  {
    key: "advertisements",
    label: "Advertisements",
    sub: "Active campaigns",
    color: "#F59E0B",
    icon: "M3 11l18-7v16l-18-7v-2zm0 0v6a2 2 0 002 2h1v-8H3z",
  },
];

function useCountUp(target) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target == null) return;
    let frame;
    const duration = 700;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return value;
}

function KpiCard({ meta, value }) {
  const count = useCountUp(value);
  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden transition-transform hover:-translate-y-0.5"
      style={{ backgroundColor: meta.color }}
    >
      <div className="h-10 w-10 rounded-xl bg-white/25 flex items-center justify-center mb-7">
        <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5">
          <path d={meta.icon} />
        </svg>
      </div>
      <div className="text-white text-[13px] font-semibold mb-0.5">{meta.label}</div>
      <div className="text-white text-[30px] font-bold tracking-tight tabular-nums leading-tight">
        {value != null ? count.toLocaleString("en-IN") : "—"}
      </div>
      <div className="text-white/75 text-[12px] font-medium">{meta.sub}</div>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 animate-pulse">
      <div className="h-10 w-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 mb-7" />
      <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-700 mb-2" />
      <div className="h-7 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
    </div>
  );
}

function HeroBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] dark:from-[#0B1220] dark:via-[#101B36] dark:to-[#1E3A8A]">
      <svg
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-40"
      >
        <polygon points="0,200 150,60 260,140 380,20 520,150 650,80 800,200" fill="rgba(255,255,255,0.08)" />
        <polygon points="0,200 220,110 340,170 480,90 620,160 800,110 800,200" fill="rgba(255,255,255,0.12)" />
      </svg>
      <div className="relative flex items-center justify-between px-6 sm:px-10 py-8 sm:py-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {/* <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 " /> */}
            {/* <span className="text-[13px] font-semibold text-white/70">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span> */}
          </div>
          <h1 className="text-[26px] sm:text-[34px] font-bold tracking-tight text-white mb-1.5">Dashboard</h1>
          <p className="text-[13px] sm:text-[15px] font-medium text-white/70 max-w-md">
            Monitor and manage your entire channel ecosystem.
          </p>
        </div>
        <div className="hidden md:block text-right shrink-0 pl-6">
          <div className="text-[26px] font-bold text-white leading-tight">Stream</div>
          <div className="text-[26px] font-bold text-white leading-tight">Manage</div>
          <div className="text-[26px] font-bold text-white leading-tight">Grow</div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, right, children }) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0F1729] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-neutral-400">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1v-6zM8 7a1 1 0 011-1h2a1 1 0 011 1v10a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 3a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1 1h-2a1 1 0 01-1-1V3z" />
          </svg>
          <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white">{title}</h3>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 shadow-lg text-[12px] font-semibold text-neutral-700 dark:text-neutral-200">
      {label}: {payload[0].value}
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const { dark } = useTheme();
  const gridColor = dark ? "#27324a" : "#eee";

  useEffect(() => {
    Promise.all([
      getChannels(),
      getPopularChannels(),
      getGenres(),
      getBanners(),
      getAdvertisements(),
    ])
      .then(([channels, popularChannels, genres, banners, advertisements]) => {
        setStats({
          channels: channels.data.data.length,
          popularChannels: popularChannels.data.data.length,
          genres: genres.data.data.length,
          banners: banners.data.data.length,
          advertisements: advertisements.data.data.length,
        });
      })
      .catch(() => setError("Failed to load dashboard stats"));
  }, []);

  const chartData = stats
    ? CARD_META.map((m) => ({ name: m.label.replace(" Channels", "\nChannels"), shortName: m.label, value: stats[m.key], color: m.color }))
    : [];

  const total = stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="font-sans">
      <HeroBanner />

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-[14px] font-medium text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {CARD_META.map((meta) =>
          stats ? (
            <KpiCard key={meta.key} meta={meta} value={stats[meta.key]} />
          ) : (
            <KpiSkeleton key={meta.key} />
          ),
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Content Overview"
          // right={
          //   <span className="rounded-full border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-[12px] font-semibold text-neutral-500 dark:text-neutral-400">
          //     This Week
          //   </span>
          // }
        >
          {stats ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis
                  dataKey="shortName"
                  tick={{ fontSize: 11, fill: dark ? "#94A3B8" : "#737373" }}
                  interval={0}
                  tickFormatter={(v) => v.split(" ")[0]}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: dark ? "#94A3B8" : "#737373" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: dark ? "#1e293b" : "#f5f5f5" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          )}
        </ChartCard>

        <ChartCard title="Content Distribution">
          {stats ? (
            <div className="flex items-center gap-4">
              <div className="relative shrink-0" style={{ width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="shortName"
                      innerRadius={62}
                      outerRadius={92}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[24px] font-bold text-neutral-900 dark:text-white leading-tight">
                    {total.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-400">Total</div>
                </div>
              </div>
              <div className="flex-1 space-y-2.5 min-w-0">
                {chartData.map((entry) => (
                  <div key={entry.shortName} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-300 truncate">
                        {entry.shortName}
                      </span>
                    </div>
                    <span className="text-[12px] font-bold text-neutral-900 dark:text-white shrink-0">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[280px] rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
