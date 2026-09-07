import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Add once in index.html <head> or index.css:
// @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&display=swap');

const CATEGORIES = [
  { label: "Sports", hue: 355 },
  { label: "News", hue: 25 },
  { label: "Movies", hue: 265 },
  { label: "Music", hue: 320 },
  { label: "Kids", hue: 45 },
  { label: "Regional", hue: 165 },
  { label: "Infotainment", hue: 200 },
  { label: "Lifestyle", hue: 285 },
];

const ICONS = {
  Sports:
    "M12 2a10 10 0 100 20 10 10 0 000-20zm0 2c1.5 0 2.9.4 4.1 1.1L14 7.2l-2-1V4zm-2 0v2.2l-2 1L5.9 5.1A7.9 7.9 0 0110 4zM4.5 7l2.3 1.7-.8 2.3H3.2A8 8 0 014.5 7zm.2 8.3l1.9-1.4 2 .7.7 2.3-1.7 1.4a8 8 0 01-2.9-3zm6.3 4.6v-2.3l1.7-1.3h1.6l1.7 1.3v2.3a8 8 0 01-5 0zm7.5-1.6l-1.7-1.4.7-2.3 2-.7 1.9 1.4a8 8 0 01-2.9 3zm3.2-5.9h-2.8l-.8-2.3L19.5 7a8 8 0 011.2 5.4z",
  News: "M4 5h16v3H4V5zm0 5h10v9H4v-9zm12 0h4v5h-4v-5zm0 6h4v3h-4v-3z",
  Movies:
    "M4 4h2l1 3H5L4 4zm4 0h2l1 3H9L8 4zm4 0h2l1 3h-2l-1-3zm4 0h2l1 3h-2l-1-3zM4 9h16v11H4V9z",
  Music:
    "M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z",
  Kids: "M12 2a3 3 0 013 3c0 1-.5 1.8-1.3 2.4L15 9h3a2 2 0 012 2v2a2 2 0 01-2 2h-1v5H7v-5H6a2 2 0 01-2-2v-2a2 2 0 012-2h3l1.3-1.6A3 3 0 019 5a3 3 0 013-3z",
  Regional:
    "M12 2C7 2 3 6 3 11c0 5 9 11 9 11s9-6 9-11c0-5-4-9-9-9zm0 12a3 3 0 110-6 3 3 0 010 6z",
  Infotainment: "M12 2l2.5 6.5H21l-5.5 4 2 6.5-5.5-4-5.5 4 2-6.5L3 8.5h6.5z",
  Lifestyle:
    "M12 21c-4-3-8-6.5-8-10.5A5 5 0 0112 6a5 5 0 018 4.5c0 4-4 7.5-8 10.5z",
};

function tileNumber(i) {
  return String(101 + i * 3).padStart(3, "0");
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Dark/light mode toggle is disabled for now — light mode only.
  // const [dark, setDark] = useState(true);
  const dark = false;

  const [activeTile, setActiveTile] = useState(0);
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  useState(() => {
    const id = setInterval(() => setActiveTile((n) => (n + 1) % 24), 900);
    return () => clearInterval(id);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate("/");
  };

  const tiles = Array.from(
    { length: 24 },
    (_, i) => CATEGORIES[i % CATEGORIES.length],
  );

const bg = dark ? "#06181A" : "#F0FDFF";

const text = dark ? "#ECFEFF" : "#0F172A";

const subtext = dark ? "#94A3B8" : "#475569";

const border = dark ? "#164E63" : "#CFFAFE";

const panelBg = dark ? "#0A2529" : "#FFFFFF";

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div
        className="w-full max-w-4xl flex rounded-2xl overflow-hidden transition-colors duration-300 shadow-xl"
        style={{
          backgroundColor: bg,
          color: text,
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          border: `1px solid ${border}`,
        }}
      >
        <style>{`
          @keyframes tileGlow {
            0%, 88%, 100% { opacity: .5; transform: scale(1); }
            6% { opacity: 1; transform: scale(1.05); box-shadow: 0 0 0 1px rgba(255,255,255,0.15); }
          }
          @keyframes tickIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseDot {
            0%, 100% { opacity: 1; } 50% { opacity: .35; }
          }
        `}</style>

        {/* Left — form (full width on mobile, 50% on lg+) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 lg:max-h-[560px] relative">
          {/*
          Dark/light mode toggle — commented out for now, light mode only.

          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="absolute top-6 right-6 sm:right-8 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
            style={{ border: `1px solid ${border}` }}
            aria-label="Toggle theme"
          >
            {dark ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-1.657-5.657a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zm-8.486 8.486a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm11.657 4.243a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414zM7.464 5.757a1 1 0 01-1.414 0l-.707-.707A1 1 0 016.757 3.636l.707.707a1 1 0 010 1.414zM10 17a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1z" />
              </svg>
            )}
          </button>
          */}

          <div className="max-w-[280px] w-full mx-auto">
            <div className="flex items-center gap-2 mb-10">
              <div
                className="h-1.5 w-1.5 rounded-full bg-[#FF453A]"
                style={{ animation: "pulseDot 2s ease-in-out infinite" }}
              />
              <span
                className="text-[13px] font-semibold tracking-wide"
                style={{ color: subtext }}
              >
                Channel Manager
              </span>
            </div>

            <h1 className="text-[34px] leading-[1.05] font-bold tracking-tight mb-2.5">
              Welcome back
            </h1>
            <p
              className="text-[14px] font-medium mb-9"
              style={{ color: subtext }}
            >
              Sign in to manage your channel lineup.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-[12px] font-semibold mb-2 transition-colors"
                  style={{ color: subtext }}
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  required
                  className="w-full bg-transparent border-0 border-b pb-2.5 text-[16px] font-medium outline-none transition-colors"
                  style={{ borderColor: border, color: text }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF453A")}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                  placeholder="ops.manager"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[12px] font-semibold mb-2 transition-colors"
                  style={{ color: subtext }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-0 border-b pb-2.5 text-[16px] font-medium outline-none transition-colors"
                  style={{ borderColor: border, color: text }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF453A")}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p
                  className="text-[12px] font-medium text-[#FF6B61]"
                  style={{ animation: "tickIn 150ms ease-out" }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 font-bold py-3 text-[14px] tracking-tight transition-all duration-150 mt-1"
                style={{
                  backgroundColor: dark ? "#F2F2F0" : "#18181B",
                  color: dark ? "#0B0C0E" : "#FAFAF9",
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p
              className="text-[11px] font-medium mt-9"
              style={{ color: dark ? "#4A4D53" : "#A1A1AA" }}
            >
              Trouble signing in? Contact your administrator.
            </p>
          </div>
        </div>

        {/* Right — animated channel wall (hidden below lg, 50% on lg+) */}
        <div
          className="hidden lg:block lg:w-1/2 relative overflow-hidden"
          style={{
            backgroundColor: panelBg,
            borderLeft: `1px solid ${border}`,
          }}
        >
          <div className="absolute inset-0 grid grid-cols-4 gap-2 p-6">
            {tiles.map((cat, i) => {
              const isActive = i === activeTile;
              return (
                <div
                  key={i}
                  className="rounded-lg flex flex-col justify-between p-2.5 transition-transform"
                  style={{
                    backgroundColor: dark
                      ? `hsl(${cat.hue}, 40%, 14%)`
                      : `hsl(${cat.hue}, 55%, 94%)`,
                    border: `1px solid ${dark ? `hsl(${cat.hue}, 40%, 22%)` : `hsl(${cat.hue}, 40%, 85%)`}`,
                    animation: isActive ? "tileGlow 0.9s ease-out" : "none",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-bold tabular-nums"
                      style={{
                        color: dark
                          ? `hsl(${cat.hue}, 60%, 65%)`
                          : `hsl(${cat.hue}, 50%, 40%)`,
                      }}
                    >
                      CH {tileNumber(i)}
                    </span>
                    {isActive && (
                      <div className="h-1 w-1 rounded-full bg-[#FF453A]" />
                    )}
                  </div>
                  <div>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-3.5 w-3.5 mb-1"
                      style={{
                        color: dark
                          ? `hsl(${cat.hue}, 55%, 60%)`
                          : `hsl(${cat.hue}, 50%, 45%)`,
                      }}
                    >
                      <path d={ICONS[cat.label]} />
                    </svg>
                    <span
                      className="text-[12px] font-bold"
                      style={{
                        color: dark
                          ? `hsl(${cat.hue}, 30%, 80%)`
                          : `hsl(${cat.hue}, 35%, 25%)`,
                      }}
                    >
                      {cat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: dark
                ? "radial-gradient(ellipse at center, transparent 45%, #0A0B0D 100%)"
                : "radial-gradient(ellipse at center, transparent 45%, #F1F1EF 100%)",
            }}
          />

          <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="h-1.5 w-1.5 rounded-full bg-[#FF453A]"
                  style={{ animation: "pulseDot 2s ease-in-out infinite" }}
                />
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: subtext }}
                >
                  Now scanning
                </span>
              </div>
              <div
                key={activeTile}
                className="text-[36px] font-bold tracking-tight"
                style={{ animation: "tickIn 300ms ease-out" }}
              >
                {tiles[activeTile].label}
              </div>
            </div>
            <span
              className="text-[11px] font-medium mb-1"
              style={{ color: dark ? "#4A4D53" : "#A1A1AA" }}
            >
              1,284 channels live
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
