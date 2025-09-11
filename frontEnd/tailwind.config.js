/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
    "./node_modules/flowbite/**/*.js",
  ],
  darkMode: 'class', // enables `dark:` classes based on a global class

  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
