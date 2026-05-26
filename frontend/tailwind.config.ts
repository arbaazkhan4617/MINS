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
        ivory: "#FAF7F0",
        sand: "#E7D3A6",
        gold: "#B99245",
        navy: "#14213D",
        charcoal: "#252A31",
        mist: "#F3F4F6"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"]
      },
      boxShadow: {
        premium: "0 24px 60px -32px rgba(20, 33, 61, 0.35)",
        card: "0 14px 40px -28px rgba(20, 33, 61, 0.45)"
      },
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(90deg, rgba(20, 33, 61, 0.78), rgba(20, 33, 61, 0.42)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=85')"
      }
    }
  },
  plugins: []
};

export default config;
