/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3949AB', // Your primary color
        secondary: '#3F51B5', // Your secondary color
        // Add more color customizations as needed
      },
      // You can also extend other theme settings as needed
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
