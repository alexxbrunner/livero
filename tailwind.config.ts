import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdfcfb',
          100: '#f8f6f3',
          200: '#e8e4dc',
          300: '#d4cdc1',
          400: '#b5a691',
          500: '#9a8972',
          600: '#7d6f5c',
          700: '#645748',
          800: '#4a3f34',
          900: '#322b23',
        },
        accent: {
          50: '#fefdfb',
          100: '#faf8f4',
          200: '#f0ebe3',
          300: '#e1d9cc',
          400: '#c9bcaa',
          500: '#b09f8a',
          600: '#8f7d68',
          700: '#6d5d4d',
          800: '#4f4439',
          900: '#342e27',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
      },
    },
  },
  plugins: [],
};

export default config;

