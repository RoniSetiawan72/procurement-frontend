/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-hover': '8px 8px 0px 0px rgba(0,0,0,1)',
      },
      colors: {
        'neo-yellow': '#F4E04D',
        'neo-blue': '#4D96FF',
        'neo-green': '#6BCB77',
        'neo-red': '#FF6B6B',
        'neo-brutal-bg': '#FFF5E1',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}