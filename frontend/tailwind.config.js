/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent1: "#7c3aed",
        accent2: "#06b6d4",
        siteText: "#e6eef8",
        siteMuted: "#94a3b8",
        bg0: "#0f172a"
      },
      boxShadow: {
        'glow-md': '0 10px 30px rgba(124,58,237,0.12)'
      }
    },
  },
  plugins: [],
}
