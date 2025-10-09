/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        gray: {
          10: '#F5F5F5',
          20: '#ECECEC',
          30: '#D9D9D9',
          40: '#BFBFBF',
          50: '#A6A6A6',
          60: '#8C8C8C',
          70: '#737373',
          80: '#595959',
          90: '#404040',
        },
        blue: {
          10: '#E6F4FE',
          40: '#84B1FA',
          70: '#0066CC',
        },
        green: {
          10: '#E6F5EC',
          60: '#038537',
        },
        bronze: {
          10: '#FEF4E6',
          60: '#AD5F00',
        },
        red: {
          10: '#FEECEC',
          60: '#DE1B1B',
        },
      },
    },
  },
  plugins: [],
};

