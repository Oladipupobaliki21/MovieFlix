/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'movie-primary': '#1e1e2f',
        'movie-secondary': '#2d2d44',
        'movie-accent': '#ff6b6b',
        'movie-text': '#ffffff',
      },
    },
  },
  plugins: [],
}