/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#030718',
          950: '#02040E',
          900: '#030718',
          850: '#050C24',
          800: '#081335',
          750: '#0D1E4E',
          700: '#142C6F',
        },
        royal: {
          DEFAULT: '#004D98',
          glow: '#0A66C2',
          vibrant: '#0055B3',
          light: '#1E70E0',
          deep: '#003366',
        },
        catalan: {
          DEFAULT: '#EDBB00',
          glow: '#FFD100',
          light: '#FFE259',
          accent: '#F5B800',
          deep: '#C49500',
        },
        slate: {
          950: '#02040E',
          900: '#030718',
          850: '#050C24',
          800: '#081335',
          750: '#0D1E4E',
          700: '#142C6F',
        },
        amber: {
          300: '#FFE259',
          400: '#FFD100',
          500: '#EDBB00',
          600: '#D9A700',
        },
        barca: {
          blue: '#004D98',
          'blue-vibrant': '#0055B3',
          'blue-light': '#1E70E0',
          'blue-dark': '#003366',
          red: '#A50044',
          'red-light': '#C4175F',
          gold: '#EDBB00',
          'gold-glow': '#FFD100',
          'gold-light': '#FFE259',
          dark: '#030718',
          'dark-card': '#060F2B',
          'dark-surface': '#081335',
          'dark-border': '#004D98',
          'away-bg': '#030718',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      boxShadow: {
        'glow-royal': '0 0 30px rgba(0, 77, 152, 0.5), 0 0 60px rgba(0, 77, 152, 0.25)',
        'glow-gold': '0 0 25px rgba(237, 187, 0, 0.55), 0 0 50px rgba(237, 187, 0, 0.25)',
        'glow-subtle': '0 0 20px rgba(0, 77, 152, 0.35)',
        'glass-royal': '0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(0, 77, 152, 0.4), inset 0 1px 0 rgba(237, 187, 0, 0.2)',
        'glass-gold': '0 15px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(237, 187, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatRev 9s ease-in-out infinite',
        'gold-glow': 'goldGlow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(20px, -20px) scale(1.04)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.96)' },
        },
        goldGlow: {
          '0%': { textShadow: '0 0 10px rgba(237, 187, 0, 0.4)' },
          '100%': { textShadow: '0 0 25px rgba(255, 209, 0, 0.8), 0 0 45px rgba(237, 187, 0, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};