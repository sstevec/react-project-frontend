/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/app/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/components/*.{js,ts,jsx,tsx}",
    "./src/lib/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enables dark mode support
  theme: {
    extend: {
    },
  },
  plugins: [],
};
