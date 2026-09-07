import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Settings() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-neutral-900 dark:text-white mb-1.5">
          Settings
        </h1>
        <p className="text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
          Manage your account and app preferences.
        </p>
      </div>

      <div className="max-w-xl space-y-4">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0F1729] p-5">
          <div className="text-[13px] font-semibold text-neutral-500 dark:text-neutral-400 mb-3">Account</div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[14px] font-medium text-neutral-600 dark:text-neutral-300">Username</span>
            <span className="text-[14px] font-semibold text-neutral-900 dark:text-white">{user?.username}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-[14px] font-medium text-neutral-600 dark:text-neutral-300">Role</span>
            <span className="text-[14px] font-semibold text-neutral-900 dark:text-white capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0F1729] p-5">
          <div className="text-[13px] font-semibold text-neutral-500 dark:text-neutral-400 mb-3">Appearance</div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-[14px] font-medium text-neutral-600 dark:text-neutral-300">Dark mode</div>
              <div className="text-[12px] font-medium text-neutral-400">Switch between light and dark themes</div>
            </div>
            <button
              onClick={toggle}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                dark ? "bg-neutral-900" : "bg-neutral-200"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  dark ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
