import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '"Inter"',
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50: "#eefdf6",
          100: "#d5f9e9",
          200: "#aef1d5",
          300: "#78e4bc",
          400: "#3ecf9c",
          500: "#16b37e",
          600: "#0a9066",
          700: "#0a7354",
          800: "#0b5b45",
          900: "#0a4b39",
          950: "#032b21",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 23 42 / 0.04), 0 8px 20px -8px rgb(15 23 42 / 0.08)",
        "card-hover": "0 14px 28px -10px rgb(15 23 42 / 0.12), 0 4px 10px -4px rgb(15 23 42 / 0.04)",
        nav: "0 -8px 24px -12px rgb(15 23 42 / 0.15)",
        floating: "0 20px 40px -15px rgba(10, 144, 102, 0.25)",
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(20px, -20px) scale(1.08)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) both",
        float: "float 16s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
      transitionTimingFunction: {
        "out-spring": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
