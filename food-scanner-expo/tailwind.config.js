const colors = require('./src/lib/utils/colors.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat-Regular'],
        medium: ['Montserrat-Medium'],
        semibold: ['Montserrat-SemiBold'],
        bold: ['Montserrat-Bold'],
      },
      fontWeight: {
        medium: undefined,
        semibold: undefined,
        bold: undefined,
      },
      // Colors imported from colors.js (single source of truth)
      colors: colors,
      fontSize: {
        // Custom typography styles matching design
        title: ['18px', '28px'],
        'title-large': ['22px', '28px'],
        number: ['15px', '25px'],
        CAPS: ['11px', '16px'],
        caption: ['14px', '18px'],
        'body-bold': ['14px', '18px'],
        'body-medium': ['14px', '18px'],
        display: ['57px', '64px'],
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [
    // Font utilities plugin
    function ({ addUtilities }) {
      addUtilities({
        '.font-medium': { fontFamily: 'Montserrat-Medium' },
        '.font-semibold': { fontFamily: 'Montserrat-SemiBold' },
        '.font-bold': { fontFamily: 'Montserrat-Bold' },
      });
    },
    // Colors plugin (alternative approach - adds colors via plugin instead of theme.extend)
    // Uncomment if you prefer this approach, but current approach (line 25) is simpler
    // function ({ addBase, theme }) {
    //   // Colors are already available via theme.extend.colors above
    //   // This plugin approach is optional and not necessary
    // },
  ],
};
