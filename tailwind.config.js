/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cpl: {
          /* Olive Green — secondary */
          sage: "#8D9B7D",
          "sage-dark": "#6B7860",
          /* Soft Sage — bg alt / badge */
          "sage-light": "#E1ECD3",
          /* Off White — main background */
          cream: "#FEFDF9",
          /* Soft Apricot — accent bg / card */
          sand: "#EABB85",
          "sand-light": "#EABB85",
          /* Amber — primary / CTA */
          amber: "#D1954E",
          "amber-dark": "#B8803C",
          /* Charcoal — text / dark bg */
          dark: "#1E1E1E",
          "dark-muted": "#555555",
          /* Off White surfaces */
          white: "#FFFFFF",
        }
      },
      fontFamily: {
        display: ['Space Grotesk', '-apple-system', 'sans-serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      }
    },
  },
  plugins: [],
}
