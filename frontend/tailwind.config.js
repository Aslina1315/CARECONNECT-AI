/** @type {import('tailwindcss').Config} */
// Palette: Trust Blue (#2563EB) + Care Mint (#14B8A6) + Indigo Glow (#6366F1)
// Soft gradient bg #F8FAFC → #EFF6FF → #ECFEFF
// Internal class names "sage" (=blue) and "terracotta" (=mint) kept for codebase continuity.
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        body: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#F8FAFC",
        surface: "#FFFFFF",
        // PRIMARY (Trust Blue) under "sage" key
        sage: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          50: "#EFF6FF",
          100: "#DBEAFE",
        },
        // ACCENT (Care Mint) under "terracotta" key
        terracotta: {
          DEFAULT: "#14B8A6",
          hover: "#0D9488",
        },
        // Indigo glow highlight
        indigo: {
          glow: "#6366F1",
          deep: "#4F46E5",
        },
        ink: "#0F172A",
        muted: "#64748B",
        line: "#E2E8F0",
        urgent: "#DC2626",
        success: "#10B981",
        background: "#F8FAFC",
        foreground: "#0F172A",
        card: { DEFAULT: "#FFFFFF", foreground: "#0F172A" },
        popover: { DEFAULT: "#FFFFFF", foreground: "#0F172A" },
        primary: { DEFAULT: "#2563EB", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#EFF6FF", foreground: "#0F172A" },
        accent: { DEFAULT: "#14B8A6", foreground: "#FFFFFF" },
        destructive: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#2563EB",
      },
      borderRadius: { lg: "1rem", md: "0.75rem", sm: "0.5rem" },
      boxShadow: {
        soft: "0 4px 24px rgba(15, 23, 42, 0.06)",
        hover: "0 18px 40px rgba(37, 99, 235, 0.20)",
        glow: "0 0 0 6px rgba(99, 102, 241, 0.15)",
        "glow-lg": "0 0 40px rgba(99, 102, 241, 0.35)",
        "glow-mint": "0 0 30px rgba(20, 184, 166, 0.30)",
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
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "blob": "blob 18s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "gradient-shift": "gradient-shift 12s ease infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        "float": "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
