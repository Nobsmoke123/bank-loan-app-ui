import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ink: "#0a0a0f",
        slate: "#1a1a2e",
        mist: "#e8e4dc",
        cream: "#f5f1eb",
        gold: "#c9a84c",
        "gold-light": "#e8c96d",
        emerald: "#2d6a4f",
        "emerald-light": "#40916c",
        danger: "#c1121f",
        "danger-light": "#e63946",
        amber: "#e07c00",
      },
    },
  },
  plugins: [],
};
export default config;
