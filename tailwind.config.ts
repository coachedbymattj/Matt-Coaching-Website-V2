import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f7f6",
          100: "#ececea",
          200: "#d6d6d2",
          300: "#b3b3ac",
          400: "#86867d",
          500: "#5d5d55",
          600: "#3f3f3a",
          700: "#2a2a26",
          800: "#1a1a17",
          900: "#101010",
          950: "#0a0a09",
        },
        ember: {
          DEFAULT: "#c8553d",
          soft: "#d97a64",
          deep: "#8e3a29",
          bright: "#e8623f",
        },
        canvas: "#f4f1ec",
      },
      fontFamily: {
        sans: ["var(--font-barlow)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: [
          "var(--font-barlow-condensed)",
          "var(--font-barlow)",
          "system-ui",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        diffusion: "0 30px 60px -25px rgba(16,16,16,0.18)",
        "diffusion-sm": "0 18px 40px -20px rgba(16,16,16,0.12)",
        "inner-glass": "inset 0 1px 0 rgba(255,255,255,0.08)",
        "ember-glow":
          "0 0 0 1px rgba(200,85,61,0.25), 0 18px 50px -18px rgba(200,85,61,0.45)",
      },
      backgroundImage: {
        "ember-grad":
          "linear-gradient(100deg, #e8623f 0%, #c8553d 45%, #8e3a29 100%)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ember-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(200,85,61,0.45)" },
          "50%": { boxShadow: "0 0 0 6px rgba(200,85,61,0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.25", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.08)" },
        },
        drift: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(16px)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-reverse": "marquee-reverse 46s linear infinite",
        breathe: "breathe 2.4s ease-in-out infinite",
        shimmer: "shimmer 2.6s linear infinite",
        "ember-pulse": "ember-pulse 2.6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 7s ease-in-out infinite",
        "drift-slow": "drift 16s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
