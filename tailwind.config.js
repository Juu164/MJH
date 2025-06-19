/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.{js,ts,jsx,tsx}'],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: '#C62828',
        accent: '#FFA726',
        dark: '#000000',
        success: '#28A745',
      },
    },
  },
  plugins: [],
};
