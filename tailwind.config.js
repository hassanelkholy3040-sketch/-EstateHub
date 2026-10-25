/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#132d29',
        forest: '#244b42',
        sage: '#557163',
        sand: '#f5f3ee',
        clay: '#955a38',
        line: '#e8e6df',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(19, 45, 41, .08)',
        card: '0 6px 24px rgba(19, 45, 41, .07)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
