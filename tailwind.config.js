/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dce8ff",
          500: "#3b5fe0",
          600: "#2f4bc4",
          700: "#25399a",
        },
        accent: {
          DEFAULT: "#FF453A",
          light: "#FF6B61",
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
