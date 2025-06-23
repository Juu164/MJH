/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#0077B6',
        accent: '#C04A00',
        dark: '#2F2F2F',
        success: '#22C55E',
        background: '#0F1115',
        neonFrom: '#9146FF',
        neonTo: '#00E5FF',
        textBase: '#F0F2F5',
      },
    },
  },
  plugins: [],
};
