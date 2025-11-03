/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        gray: {
          10: "#F5F7FA",
          20: "#EBEFF5",
          30: "#DDE3ED",
          40: "#C8D1E0",
          50: "#AFBACC",
          60: "#8E99AB",
          70: "#707A8A",
          80: "#58606E",
          90: "#434A54",
          100: "#333840",
        },
        blue: {
          10: "#F0F5FC",
          20: "#F0F5FC",
          30: "#ACCBFC",
          40: "#84B1FA",
          50: "#5691F0",
          60: "#3272D9",
          70: "#1D5BBF",
          80: "#114599",
          90: "#103570",
          100: "#15233B",
        },
        green: {
          10: "#E1FAEB",
          60: "#038537",
        },
        bronze: {
          10: "#FCF2E6",
          60: "#AD5F00",
        },
        red: {
          10: "#FAF0F0",
          60: "#DE1B1B",
        },
        white: "#FFFFFF",
        black: "#000000",
      },
      fontFamily: {
        montserrat: ["Montserrat"],
      },
    },
  },
  plugins: [],
};

