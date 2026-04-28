/** @type {import('tailwindcss').Config} */
// "Warm Care" palette — rose-coral primary + warm amber accent + deep cocoa ink + warm cream bg
// Internal class names kept (sage/terracotta/indigo-glow) to avoid touching every reference.
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        // Fraunces: warm, soulful, optical-sized serif. Plus Jakarta: friendly modern body.
        heading: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        body: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#FFF8F1",
        surface: "#FFFFFF",
        // PRIMARY (rose-coral) under "sage" key
        sage: {
          DEFAULT: "#E11D48",
          hover: "#BE123C",
          50: "#FFF1F2",
          100: "#FFE4E6",
        },
        // ACCENT (warm amber) under "terracotta" key
        terracotta: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
        },
        // Highlight (deep saddle/coffee) under "indigo" key
        indigo: {
          glow: "#B45309",
          deep: "#7C2D12",
        },
        ink: "#1C1917",
        muted: "#78716C",
        line: "#EFE4D2",
        urgent: "#DC2626",
        success: "#16A34A",
        background: "#FFF8F1",
        foreground: "#1C1917",
        card: { DEFAULT: "#FFFFFF", foreground: "#1C1917" },
        popover: { DEFAULT: "#FFFFFF", foreground: "#1C1917" },
        primary: { DEFAULT: "#E11D48", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#FFF1F2", foreground: "#1C1917" },
        accent: { DEFAULT: "#F59E0B", foreground: "#1C1917" },
        destructive: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
        border: "#EFE4D2",
        input: "#EFE4D2",
        ring: "#E11D48",
      },
      borderRadius: { lg: "1rem", md: "0.75rem", sm: "0.5rem" },
      boxShadow: {
        soft: "0 4px 24px rgba(60, 30, 12, 0.06)",
        hover: "0 18px 40px rgba(225, 29, 72, 0.18)",
        glow: "0 0 0 6px rgba(245, 158, 11, 0.18)",
        "glow-lg": "0 0 40px rgba(225, 29, 72, 0.30)",
        "glow-amber": "0 0 28px rgba(245, 158, 11, 0.40)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "blob": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(40px,-30px) scale(1.08)" },
          "66%": { transform: "translate(-30px,30px) scale(0.94)" },
        },
        "shimmer": { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "float": { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "blob": "blob 18s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "gradient-shift": "gradient-shift 14s ease infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        "float": "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
