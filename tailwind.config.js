/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.html",
     "./src/**/*.js",
     "./templates/**/*.html",
    ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['GDS Transport','Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

