import type { Config } from "tailwindcss";

// Brand tokens — "Italia Coperta" design system (see chats/chat1.md + brief).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#000000",
        "navy-deep": "#1A1980",
        "navy-black": "#000000",
        primary: "#E31919",
        "primary-light": "#FF4D4D",
        indaco: "#3533CD",
        "tricolore-verde": "#25904A",
        "tricolore-rosso": "#D82427",
        acciaio: "#6B7280",
        avorio: "#F3E9CC",
        sfondo: "#FAF8F3",
        inchiostro: "#151A24",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #000000 0%, #3533CD 100%)",
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
