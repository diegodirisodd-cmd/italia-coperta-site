import type { Config } from "tailwindcss";

// Brand tokens — "Italia Coperta" design system (see chats/chat1.md + brief).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Restyling: pure black (#000) on every other section made the site feel
        // heavy. Dark surfaces are now a soft "ink" with a hint of the brand blue.
        navy: "#0B0D18",
        "navy-deep": "#1A1980",
        "navy-black": "#07080F",
        ink: "#0B0D18",
        "ink-soft": "#121528",
        // Brand red. #E31919 gave 4.42:1 against black (CTA text, red text on black
        // sections) — a hair under WCAG AA. #E61C1C reaches 4.55:1 and is visually
        // indistinguishable.
        primary: "#E61C1C",
        "primary-light": "#FF4D4D",
        // Hover for red buttons with white text (keeps contrast, unlike primary-light).
        "primary-dark": "#C41515",
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
