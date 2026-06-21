import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8FAFC",
        sand: "#E2E8F0",
        gold: "#D97706",
        navy: "#0F172A",
        charcoal: "#1E293B",
        mist: "#F1F5F9"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-inter)", "Inter", "sans-serif"]
      },
      boxShadow: {
        premium: "0 24px 60px -32px rgba(15, 23, 42, 0.15)",
        card: "0 14px 40px -28px rgba(15, 23, 42, 0.25)"
      },
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.55)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=85')"
      }
    }
  },
  plugins: []
};

export default config;
