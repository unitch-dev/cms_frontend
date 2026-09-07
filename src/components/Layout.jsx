import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebar_collapsed") === "true");

  const toggleCollapse = () => {
    setCollapsed((c) => {
      localStorage.setItem("sidebar_collapsed", String(!c));
      return !c;
    });
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-[#0B1120] text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-200">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-[#0F1729] border-r border-neutral-200 dark:border-neutral-800 transition-[width] duration-300 ease-out ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      </aside>

      {/* Mobile drawer (always full width, collapse doesn't apply on mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            style={{ animation: "fadeIn 180ms ease-out" }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="relative w-72 max-w-[80vw] h-full flex flex-col bg-white dark:bg-[#0F1729]"
            style={{ animation: "slideInLeft 220ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <style>{`
              @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
              @keyframes slideInLeft { from { transform: translateX(-100%) } to { transform: translateX(0) } }
            `}</style>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}