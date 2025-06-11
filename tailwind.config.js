
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1E40AF', // Example primary color (blue-700)
        'secondary': '#DB2777', // Example secondary color (pink-600)
        'accent': '#F59E0B', // Example accent color (amber-500)
        'neutral-dark': '#1F2937', // gray-800
        'neutral-light': '#F3F4F6', // gray-100
        'background-dark': '#111827', // gray-900
        'background-light': '#E5E7EB', // gray-200
      }
    },
  },
  plugins: [],
}
