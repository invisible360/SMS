/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      // 'myFont' : ['Alegreya', 'serif'],
      // 'myFont' : ['Merriweather', 'serif'],
      'myFont' : [ '"Exo 2"', 'sans-serif'],
      // 'myFont': ['"Poppins"', 'sans-serif'],

    },
  },
  plugins: [require("daisyui")],
}