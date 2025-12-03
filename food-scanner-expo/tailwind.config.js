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
        inter: ['Inter-Regular'],
        'inter-medium': ['Inter-Medium'],
        'inter-semibold': ['Inter-SemiBold'],
        'inter-bold': ['Inter-Bold'],
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
    // Default font family plugin - applies Montserrat-Regular to fontSize utilities
    // This must come FIRST so font weight utilities can override it
    function ({ addUtilities, theme }) {
      const defaultFont = 'Montserrat-Regular';

      // Add fontFamily to all fontSize utilities (text-title, text-caption, etc.)
      const fontSizeUtilities = {};
      Object.keys(theme('fontSize')).forEach((key) => {
        fontSizeUtilities[`.text-${key}`] = {
          fontFamily: defaultFont,
        };
      });

      addUtilities(fontSizeUtilities);
    },
    // Font weight utilities plugin - must come AFTER fontSize utilities to override
    function ({ addUtilities }) {
      addUtilities({
        '.font-medium': { fontFamily: 'Montserrat-Medium' },
        '.font-semibold': { fontFamily: 'Montserrat-SemiBold' },
        '.font-bold': { fontFamily: 'Montserrat-Bold' },
        // Inter font utilities
        '.font-inter': { fontFamily: 'Inter-Regular' },
        '.font-inter-medium': { fontFamily: 'Inter-Medium' },
        '.font-inter-semibold': { fontFamily: 'Inter-SemiBold' },
        '.font-inter-bold': { fontFamily: 'Inter-Bold' },
      });
    },
  ],
};
