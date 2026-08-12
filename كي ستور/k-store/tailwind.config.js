/** @type {import('tailwind.config').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f6f4",
          100: "#e8e8e3",
          200: "#c9c8bf",
          300: "#a3a297",
          400: "#7d7c70",
          500: "#5c5b51",
          600: "#44433c",
          700: "#2f2e29",
          800: "#1d1c19",
          900: "#121110",
          950: "#0a0908",
        },
        gold: {
          50: "#fbf7ed",
          100: "#f6ecd0",
          200: "#ecd79c",
          300: "#e3bd5f",
          400: "#d9a73c",
          500: "#c8902a",
          600: "#a96f22",
          700: "#875220",
          800: "#6f4221",
          900: "#5d3820",
        },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        display: ["var(--font-tajawal)", "var(--font-cairo)", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 20px 60px -15px rgba(0,0,0,0.5)",
        "luxe-sm": "0 8px 30px -12px rgba(0,0,0,0.45)",
        gold: "0 10px 40px -10px rgba(200,144,42,0.45)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out both",
        shimmer: "shimmer 2s linear infinite",
        floatY: "floatY 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
