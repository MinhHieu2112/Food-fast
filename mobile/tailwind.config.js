/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",   // gom luôn cho chắc chắn
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f13a01",
      },
    },
  },
  plugins: [],
}

