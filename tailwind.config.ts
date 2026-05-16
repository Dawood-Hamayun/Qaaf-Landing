import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Candlelight palette — semantic tokens driven by CSS vars
        bg: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          soft: "rgb(var(--bg-soft) / <alpha-value>)",
          card: "rgb(var(--bg-card) / <alpha-value>)",
          lift: "rgb(var(--bg-lift) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          dim: "rgb(var(--ink-dim) / <alpha-value>)",
          mute: "rgb(var(--ink-mute) / <alpha-value>)",
          deep: "rgb(var(--ink-deep) / <alpha-value>)",
        },
        amber: {
          DEFAULT: "rgb(var(--amber) / <alpha-value>)",
          soft: "rgb(var(--amber-soft) / <alpha-value>)",
          deep: "rgb(var(--amber-deep) / <alpha-value>)",
        },
        hairline: "rgb(var(--hairline) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-figtree)", "Inter", "system-ui", "sans-serif"],
        arabic: ["var(--font-amiri)", "Amiri", "serif"],
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(232, 184, 106, 0.55), 0 0 120px -30px rgba(232, 184, 106, 0.35)",
        phone:
          "0 30px 80px -20px rgba(0,0,0,0.55), 0 12px 30px -10px rgba(0,0,0,0.35)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "45%": { opacity: "0.92" },
          "55%": { opacity: "0.96" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        flicker: "flicker 6s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
