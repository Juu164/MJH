/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.{js,ts,jsx,tsx}'],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: '#A855F7',
        accent: '#06B6D4',
        dark: '#0E0F13',
        success: '#22C55E',
        light: '#E5E7EB',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 15px rgba(168, 85, 247, 0.6)',
      },
    },
  },
  plugins: [],
};
