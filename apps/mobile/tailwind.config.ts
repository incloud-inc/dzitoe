import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
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
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 10px 24px -14px rgb(15 23 42 / 0.22)",
        nav: "0 -10px 28px -18px rgb(15 23 42 / 0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.28s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
