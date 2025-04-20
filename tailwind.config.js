/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6e6ff',
          100: '#c2c2ff',
          200: '#9f9fff',
          300: '#7c7cff',
          400: '#5959ff',
          500: '#0000FF',
          600: '#0000cc',
          700: '#000099',
          800: '#000066',
          900: '#000033',
        },
        accent: {
          black: '#0A0A0A',
          blue: '#e6e6ff',
        },
        background: {
          light: '#ffffff',
          dark: '#0A0A0A'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 15s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
    },
  },
  plugins: [],
};