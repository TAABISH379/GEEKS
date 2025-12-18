/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B04B00', // A warm, inviting orange-brown
          50: '#FFF7ED',
          100: '#FFEED9',
          200: '#FFD7AF',
          300: '#FFBF85',
          400: '#FF974C',
          500: '#FF6D00', // Original DEFAULT
          600: '#CC5700',
          700: '#994100',
          800: '#662B00',
          900: '#331600',
          950: '#1A0B00',
        },
        secondary: {
          DEFAULT: '#3B82F6', // A calming blue
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // Original DEFAULT
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        accent: {
          DEFAULT: '#10B981', // A fresh green
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Original DEFAULT
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        'background-light': '#FDFCFB',
        'background-dark': '#EBEBEB',
        'text-dark': '#1F2937',
        'text-light': '#F9FAFB',
      }
    },
  },
  plugins: [],
}
