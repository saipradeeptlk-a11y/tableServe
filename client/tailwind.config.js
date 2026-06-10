/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        dark: '#1A1A2E',
        card: '#16213E',
      }
    },
  },
  plugins: [],
}

