export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#0ea5e9",
          600: "#0284c7",
          900: "#082f49",
        },
        secondary: {
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        success: {
          500: "#10b981",
          600: "#059669",
        },
        warning: {
          500: "#f59e0b",
          600: "#d97706",
        },
        danger: {
          500: "#ef4444",
          600: "#dc2626",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",
        fadeIn: "fadeIn 0.3s ease-in",
        slideUp: "slideUp 0.3s ease-out",
        slideDown: "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      spacing: {
        safe: "max(1rem, env(safe-area-inset-bottom))",
      },
    },
  },
  plugins: [],
}
