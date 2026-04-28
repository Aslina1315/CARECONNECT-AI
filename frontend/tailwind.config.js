/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#FDFBF7",
        surface: "#FFFFFF",
        sage: {
          DEFAULT: "#5E8B7E",
          hover: "#4A7065",
          50: "#EEF3F1",
          100: "#DCE8E4",
        },
        terracotta: {
          DEFAULT: "#D4A373",
          hover: "#B3875B",
        },
        ink: "#2B3A35",
        muted: "#6B7F78",
        line: "#E8E5DF",
        urgent: "#E07A5F",
        success: "#81B29A",
        background: "#FDFBF7",
        foreground: "#2B3A35",
        card: { DEFAULT: "#FFFFFF", foreground: "#2B3A35" },
        popover: { DEFAULT: "#FFFFFF", foreground: "#2B3A35" },
        primary: { DEFAULT: "#5E8B7E", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#EEF3F1", foreground: "#2B3A35" },
        accent: { DEFAULT: "#F4ECE0", foreground: "#2B3A35" },
        destructive: { DEFAULT: "#E07A5F", foreground: "#FFFFFF" },
        border: "#E8E5DF",
        input: "#E8E5DF",
        ring: "#5E8B7E",
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.04)",
        hover: "0 20px 40px rgba(0,0,0,0.08)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "blob": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-20px) scale(1.05)" },
          "66%": { transform: "translate(-20px,20px) scale(0.95)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "blob": "blob 14s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
