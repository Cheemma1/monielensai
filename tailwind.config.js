/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat-Regular'],
        montserratMedium: ['Montserrat-Medium'],
        montserratSemiBold: ['Montserrat-SemiBold'],
        montserratBold: ['Montserrat-Bold'],
      },
      colors: {
        primary: '#0052FE',
        secondary: '#22C55E',
        textGray: '#46464D',
        card: '#FFFFFF',
        textdark: '#03071D',
        muted: '#64748B',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#22C55E',
      },
    },
  },
  plugins: [],
};
