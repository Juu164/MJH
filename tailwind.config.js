/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.{js,ts,jsx,tsx}'],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: '#0077B6',
        accent: '#C04A00',
        dark: '#2F2F2F',
        success: '#22C55E',
      },
    },
  },
  plugins: [],
};
