import { NavLink } from "react-router-dom";

const mainNavItems = [
  {
    to: "/",
    label: "Dashboard",
    end: true,
    icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  },
  {
    to: "/channels",
    label: "Channels",
    icon: "M4 5h16v3H4V5zm0 5h10v9H4v-9zm12 0h4v5h-4v-5zm0 6h4v3h-4v-3z",
  },
  {
    to: "/popular-channels",
    label: "Popular Channels",
    icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.98 20.94a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  },
  {
    to: "/genres",
    label: "Genres",
    icon: "M4 5a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm9 0a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-5a1 1 0 01-1-1V5zM4 14a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5zm9 0a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5z",
  },
  {
    to: "/banners",
    label: "Banners",
    icon: "M3 4a1 1 0 011-1h16a1 1 0 011 1v3H3V4zm0 5h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9zm3 3v2h6v-2H6z",
  },
  {
    to: "/advertisements",
    label: "Advertisements",
    icon: "M3 11l18-7v16l-18-7v-2zm0 0v6a2 2 0 002 2h1v-8H3z",
  },
];

const footerNavItems = [
  // {
  //   to: "/settings",
  //   label: "Settings",
  //   icon: "M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z",
  // },
  {
    to: "/help",
    label: "Help",
    icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a1.5 1.5 0 112.12 2.12c-.29.29-.56.5-.56 1.19v.25a.75.75 0 01-1.5 0v-.25c0-1.19.68-1.7 1.06-2.06a.5.5 0 10-.85-.35.75.75 0 01-1.5 0 2 2 0 012.23-1.9zM10 15a.9.9 0 100-1.8.9.9 0 000 1.8z",
  },
];

function NavItem({ item, onNavigate, collapsed }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={`group relative flex items-center gap-3 rounded-xl py-2.5 text-[14px] font-semibold transition-all duration-200 ${
        collapsed ? "justify-center px-0" : "px-3"
      }`}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute inset-0 rounded-xl bg-[#0284C7] dark:bg-[#0EA5E9] transition-colors duration-200" />
          )}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`relative h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 ${
              isActive
                ? "text-white"
                : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
            }`}
          >
            <path d={item.icon} />
          </svg>
          <span
            className={`relative whitespace-nowrap transition-all duration-200 ${
              collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            } ${
              isActive
                ? "text-white"
                : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200"
            }`}
          >
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ onNavigate, collapsed = false, onToggleCollapse }) {
  return (
    <div className="relative flex h-full flex-col">
      <div
        className={`h-16 flex items-center gap-2.5 border-b border-neutral-200 dark:border-neutral-800 shrink-0 ${
          collapsed ? "justify-center px-2" : "px-5"
        }`}
      >
        <div className="h-8 w-8 rounded-lg bg-[#0284C7] dark:bg-[#0EA5E9] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4 ml-0.5">
            <path d="M6 4.5v11l9-5.5-9-5.5z" />
          </svg>
        </div>
        <span
          className={`text-[15px] font-bold tracking-tight whitespace-nowrap text-neutral-900 dark:text-white transition-all duration-200 ${
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          }`}
        >
          Channel Manager
        </span>
      </div>

      <nav className={`flex-1 py-5 space-y-1 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`}>
        {mainNavItems.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={onNavigate} collapsed={collapsed} />
        ))}
      </nav>

      <div
        className={`py-3 space-y-1 border-t border-neutral-100 dark:border-neutral-800 ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
        {footerNavItems.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={onNavigate} collapsed={collapsed} />
        ))}
      </div>

      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-1/2 -right-3.5 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-[#0284C7] dark:border-[#0EA5E9] bg-[#0284C7] dark:bg-[#0EA5E9] text-white shadow-md shadow-[#0284C7]/40 dark:shadow-[#0EA5E9]/40 transition-all duration-200 hover:bg-[#026aa3] dark:hover:bg-[#38bdf8] hover:scale-110 active:scale-95"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}