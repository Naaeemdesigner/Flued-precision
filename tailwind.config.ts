import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand tokens
        matte: "#0A0A0A",
        charcoal: "#121212",
        ink: "#0E0E0E",
        red: {
          DEFAULT: "#E63946",
          50: "#FEE9EB",
          100: "#FBC9CD",
          200: "#F58A92",
          300: "#EF5C66",
          400: "#E63946",
          500: "#C4222F",
          600: "#8A1F26",
        },
        silver: {
          DEFAULT: "#C0C0C0",
          50: "#F5F5F5",
          100: "#E0E0E0",
          200: "#C0C0C0",
          300: "#9A9A9A",
          400: "#6E6E6E",
          500: "#404040",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-syncopate)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Brand strict radii
        "2xl": "20px",
        "3xl": "32px",
        brand: "32px",
        chip: "20px",
      },
      letterSpacing: {
        tightish: "0.05em",
        brand: "5px",
        "brand-sm": "3px",
        "brand-md": "4px",
      },
      backdropBlur: {
        glass: "20px",
        "glass-deep": "25px",
        "glass-ultra": "30px",
        overlay: "45px",
      },
      boxShadow: {
        "elev-1": "0 8px 32px rgba(0,0,0,0.35)",
        "elev-2": "0 16px 48px rgba(0,0,0,0.5)",
        "elev-3": "0 24px 64px rgba(0,0,0,0.55)",
        "glow-red": "0 0 32px rgba(230,57,70,0.7), 0 0 64px rgba(230,57,70,0.35)",
        "glow-red-soft": "0 0 24px rgba(230,57,70,0.4)",
      },
      transitionTimingFunction: {
        "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
        "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        pulseRed: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(230,57,70,0.55)" },
          "50%": { boxShadow: "0 0 24px rgba(230,57,70,0.8)" },
        },
        knobPulse: {
          "0%, 100%": { boxShadow: "0 0 0 6px rgba(230,57,70,0.18), 0 0 24px rgba(230,57,70,0.5)" },
          "50%": { boxShadow: "0 0 0 14px rgba(230,57,70,0), 0 0 36px rgba(230,57,70,0.85)" },
        },
        zoneBreath: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.015)", opacity: "1" },
        },
      },
      animation: {
        "pulse-red": "pulseRed 2.4s ease-in-out infinite",
        "knob-pulse": "knobPulse 2.4s ease-in-out infinite",
        "zone-breath": "zoneBreath 3.6s ease-in-out infinite",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, addBase, theme }) {
      addBase({
        ":root": {
          "--brand-radius": "32px",
          "--brand-silver": "#C0C0C0",
          "--brand-red": "#E63946",
          "--brand-black": "#0A0A0A",
        },
      });
      addUtilities({
        // Metallic linear gradients (chrome / red-chrome)
        ".text-chrome": {
          "background-image": "linear-gradient(180deg,#FFFFFF 0%,#C0C0C0 50%,#8A8A8A 100%)",
          "-webkit-background-clip": "text",
          "background-clip": "text",
          color: "transparent",
        },
        ".text-chrome-red": {
          "background-image": "linear-gradient(180deg,#FFFFFF 0%,#E63946 60%,#8A1F26 100%)",
          "-webkit-background-clip": "text",
          "background-clip": "text",
          color: "transparent",
        },
        ".border-chrome": {
          "border-image": "linear-gradient(180deg,#FFFFFF 0%,#C0C0C0 50%,#8A8A8A 100%) 1",
        },
        // Glassmorphism variants
        ".glass": {
          background: "rgba(255,255,255,0.03)",
          "backdrop-filter": "blur(25px)",
          "-webkit-backdrop-filter": "blur(25px)",
          border: "1px solid rgba(192,192,192,0.15)",
          "border-radius": "32px",
        },
        ".glass-deep": {
          background: "rgba(10,10,10,0.85)",
          "backdrop-filter": "blur(30px)",
          "-webkit-backdrop-filter": "blur(30px)",
          border: "1px solid rgba(192,192,192,0.2)",
        },
        ".glass-soft": {
          background: "rgba(255,255,255,0.04)",
          "backdrop-filter": "blur(15px)",
          "-webkit-backdrop-filter": "blur(15px)",
          border: "1px solid rgba(192,192,192,0.15)",
        },
        // Atmospheric red mesh
        ".bg-mesh-red": {
          "background-image":
            "radial-gradient(60% 50% at 15% 65%, rgba(230,57,70,0.10) 0%, rgba(230,57,70,0) 70%), radial-gradient(45% 40% at 85% 25%, rgba(230,57,70,0.06) 0%, rgba(230,57,70,0) 70%)",
        },
        // Hide scrollbar
        ".no-scrollbar": {
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        // Thumb-zone safe area (mobile)
        ".pb-thumb": {
          "padding-bottom": "max(env(safe-area-inset-bottom), 1rem)",
        },
      });
    }),
  ],
};

export default config;
