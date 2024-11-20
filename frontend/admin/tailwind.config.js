/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        pause: {
          '0%, 100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        shake: 'shake 1s ease-in-out infinite',
        'shake-pause': 'shake 1s ease-in-out 2s infinite',
      },
    },
  },
  plugins: [],
}