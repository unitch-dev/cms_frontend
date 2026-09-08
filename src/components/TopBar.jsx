import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import LiveClock from "./LiveClock.jsx";

export default function TopBar({ onOpenMobileMenu }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = (user?.username || "?").slice(0, 2).toUpperCase();

  return (
    <div className="h-16 flex items-center gap-3 px-4 sm:px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0F1729] transition-colors duration-200 shrink-0">
      <button
        onClick={onOpenMobileMenu}
        className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
        aria-label="Open menu"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="hidden sm:flex items-center gap-3 rounded-full bg-[#F0F9FF] dark:bg-[#0EA5E9]/10 border border-[#E0F2FE] dark:border-[#0EA5E9]/20 pl-2 pr-4 py-1.5 shrink-0">
        <div className="h-7 w-7 rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 20 20" fill="white" className="h-3.5 w-3.5 ml-0.5">
            <path d="M6 4.5v11l9-5.5-9-5.5z" />
          </svg>
        </div>
        <span className="text-[14px] font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
          Channel Manager
        </span>
        <span className="h-4 w-px bg-[#0284C7]/30 dark:bg-[#0EA5E9]/30 shrink-0" />
        <span className="text-[13px] italic font-semibold text-[#0284C7] dark:text-[#38BDF8] whitespace-nowrap">
          Connect. Manage. Stream.
        </span>
      </div>

      <div className="flex-1 max-w-md">
        <LiveClock />
      </div>

      <div className="flex-1 hidden sm:block" />

      <button
        onClick={toggle}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="h-9 w-9 rounded-full flex items-center justify-center text-neutral-500 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
      >
        {dark ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]">
            <path
              fillRule="evenodd"
              d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 101.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 14.596a.75.75 0 001.06 1.06l1.061-1.06a.75.75 0 10-1.06-1.06l-1.061 1.06zM5.404 5.404a.75.75 0 001.06 1.06l1.06-1.06a.75.75 0 10-1.06-1.06l-1.06 1.06z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-bold bg-[#0284C7] dark:bg-[#0EA5E9] text-white">
            {initials}
          </div>
          <span className="hidden sm:block text-[13px] font-semibold text-neutral-700 dark:text-neutral-200">
            {user?.username || "Admin"}
          </span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`hidden sm:block h-3.5 w-3.5 text-neutral-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 mt-2 w-52 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg py-1.5 z-50"
            style={{ animation: "fadeIn 120ms ease-out" }}
          >
            <div className="px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-700">
              <div className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                {user?.username}
              </div>
              <div className="text-[11px] font-medium text-neutral-400">
                {user?.role === "admin" ? "Administrator" : "Editor"}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
                <path
                  fillRule="evenodd"
                  d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6 10a.75.75 0 01.75-.75h9.19l-2.72-2.72a.75.75 0 111.06-1.06l4 4a.75.75 0 010 1.06l-4 4a.75.75 0 11-1.06-1.06l2.72-2.72H6.75A.75.75 0 016 10z"
                  clipRule="evenodd"
                />
              </svg>
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}