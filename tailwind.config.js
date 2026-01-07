/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        parabolica: ['var(--font-parabolica)', 'system-ui', 'sans-serif'],
      },
      lineClamp: {
        2: '2',
        3: '3',
      },
    },
  },
  plugins: [],
}