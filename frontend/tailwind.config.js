/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "1600px",
      },
    },
    animation: {
      'fade-in': '150ms ease-in forwards fadeIn',
      'fade-out': '150ms ease-out forwards fadeOut',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      fadeOut: {
        '0%': { opacity: 1 },
        '100%': { opacity: 0 },
      },
    },
  },
  plugins: [require('daisyui')],
}

