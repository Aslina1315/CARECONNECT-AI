/** @type {import('tailwindcss').Config} */
// "Sage Linen" palette: warm cream + muted sage + soft tan blush + subtle silver glow.
// Internal class names kept (sage/terracotta/indigo-glow) to avoid touching every reference.
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        // Playfair Display — elegant, professional, magazine-grade serif (HEADINGS ONLY).
        // Body stays Plus Jakarta Sans (which the user likes).
        heading: ['"Playfair Display"', "ui-serif", "Georgia", "serif"],
        body: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#F7F3ED",
        surface: "#FFFFFF",
        // PRIMARY (muted sage) under "sage" key
        sage: {
          DEFAULT: "#6B8E7F",
          hover: "#557064",
          50: "#EEF2EE",
          100: "#DCE6DD",
        },
        // ACCENT (soft tan blush) under "terracotta" key
        terracotta: {
          DEFAULT: "#D9B89C",
          hover: "#BFA083",
        },
        // Highlight (subtle pastel lavender) under "indigo" key
        indigo: {
          glow: "#C5B6D8",
          deep: "#9C8AA5",
        },
        ink: "#2A3329",
        muted: "#6B756A",
        line: "#E5DED1",
        // Soft silver tone for ultra-subtle highlights
        silver: "#D9DEDC",
        urgent: "#C2483A",
        success: "#5B8A75",
        background: "#F7F3ED",
        foreground: "#2A3329",
        card: { DEFAULT: "#FFFFFF", foreground: "#2A3329" },
        popover: { DEFAULT: "#FFFFFF", foreground: "#2A3329" },
        primary: { DEFAULT: "#6B8E7F", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#EEF2EE", foreground: "#2A3329" },
        accent: { DEFAULT: "#D9B89C", foreground: "#2A3329" },
        destructive: { DEFAULT: "#C2483A", foreground: "#FFFFFF" },
        border: "#E5DED1",
        input: "#E5DED1",
        ring: "#6B8E7F",
      },
      borderRadius: { lg: "1rem", md: "0.75rem", sm: "0.5rem" },
      boxShadow: {
        soft: "0 4px 24px rgba(42, 51, 41, 0.06)",
        hover: "0 18px 40px rgba(107, 142, 127, 0.18)",
        glow: "0 0 0 6px rgba(217, 184, 156, 0.18)",
        "glow-lg": "0 0 40px rgba(107, 142, 127, 0.28)",
        // Subtle silver glow used sparingly
        silver: "0 0 0 1px rgba(217, 222, 220, 0.6), 0 8px 28px rgba(120, 130, 128, 0.10)",
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
