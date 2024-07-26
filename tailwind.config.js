/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        moveTheWave: {
          '0%': { strokeDashoffset: '0', transform: 'translate3d(0, 0, 0)' },
          '100%': { strokeDashoffset: '-133', transform: 'translate3d(-90px, 0, 0)' },
        },
      },
      animation: {
        moveTheWave: 'moveTheWave 2.4s linear infinite',
        moveTheWaveSlow: 'moveTheWave 4.8s linear infinite',
      },
    },
  },
  plugins: [],
}