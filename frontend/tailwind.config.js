/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blush-pink': '#F8D7E3',
        'hot-pink': '#F4A6C6',
        'lilac': '#C9A8E0',
        'window-purple': '#B9A6E0',
        'titlebar-purple': '#8B6FCE',
        'deep-navy': '#14163A',
        'cream': '#F5EFE0',
        'ink-brown': '#4A3F52',
        'gold-accent': '#E8B84B',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}