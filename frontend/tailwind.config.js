/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4A3267',
        secondary: '#DE638A',
        pink: '#F7B9C4',
        bgLight: '#F5F0FF',
        cardLight: '#FFFFFF',
        borderLight: '#C6BADE',
        textPrimary: '#2D1B3E',
        textSecondary: '#6B5B7E',
        darkBg: '#1A0F2E',
        darkCard: '#2D1B3E',
        darkBorder: '#4A3267',
        darkText: '#F5F0FF',
        darkTextSecondary: '#F7B9C4',
      },
      borderRadius: {
        card: '16px',
        button: '8px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4A3267 0%, #DE638A 100%)',
      },
    },
  },
  plugins: [],
}