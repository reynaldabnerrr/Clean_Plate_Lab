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
          sage: "#8A9C7A",
          "sage-dark": "#647554",
          "sage-light": "#EBF0E6",
          cream: "#F5F2EA",
          sand: "#D6C7B0",
          "sand-light": "#F0EAE1",
          dark: "#1E1E1E",
          "dark-muted": "#555555",
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
