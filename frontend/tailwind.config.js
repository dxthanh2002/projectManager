/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        p: {
          50: "#f0f9ff",
          200: "#e0f2fe",
          600: "#0284c7",
          700: "#0369a1",
          900: "#082f49",
        },
        n: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        lobster: ["Lobster", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      screens: {
        sm: "30rem",    /* 480px */
        md: "48rem",    /* 768px */
        lg: "80rem",    /* 1280px */
        xl: "87.5rem",  /* 1400px */
        "2xl": "96rem", /* 1536px */
      },
    },
  },
  plugins: [],
}