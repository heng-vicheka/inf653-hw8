/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./views/**/*.hbs'],
  theme: {
    extend: {
      colors: {
        'deep-red': {
          600: '#b91c1c', // Main Red
          700: '#991b1b', // Darker Red
        },
      },
    },
  },
  plugins: [],
};
