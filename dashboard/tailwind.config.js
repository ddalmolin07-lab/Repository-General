/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', '-apple-system', 'sans-serif'],
      },
      width:  { sidebar: '196px' },
      height: { kpibar:  '52px'  },
    },
  },
  plugins: [],
}
