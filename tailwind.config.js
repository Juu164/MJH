/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#C62828',
        accent: '#FFA726',
        dark: '#000000',
      },
    },
  },
  plugins: [],
};
