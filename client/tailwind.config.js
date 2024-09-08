// tailwind.config.js
const { theme } = require('./src/styles/theme');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: theme.colors,
      fontFamily: {
        sans: [theme.typography.fontFamily],
      },
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeight,
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      boxShadow: theme.shadows,
      screens: theme.breakpoints,
    },
  },
  plugins: [],
}