/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Support for dark mode
  theme: {
    extend: {
      colors: {
        'ice-blue': '#D6E6F3',
        'powder-blue': '#A6C5D7',
        'sapphire': '#0F52BA',
        'deep-navy': '#000926',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
