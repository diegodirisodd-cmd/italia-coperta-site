import type { Config } from "tailwindcss";

// Brand tokens — "Italia Coperta" design system (see chats/chat1.md + brief).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B2545",
        "navy-deep": "#081A33",
        "navy-black": "#061529",
        oro: "#C9A227",
        "oro-light": "#E3C765",
        acciaio: "#6B7280",
        avorio: "#F3E9CC",
        sfondo: "#FAF8F3",
        inchiostro: "#151A24",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        icPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.55" },
          "50%": { transform: "scale(1.9)", opacity: "0" },
        },
      },
      animation: {
        "ic-pulse": "icPulse 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
