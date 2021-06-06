const colors = require("tailwindcss/colors");

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"]
      },
      colors: {
        gray: colors.coolGray,
        blue: colors.lightBlue,
        red: colors.rose,
        pink: colors.fuchsia,
        white: colors.white,
        black: colors.black
      },
      spacing: {
        "128": "32rem",
        "144": "36rem"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  variants: {
    extend: {
      borderColor: ["focus-visible"],
      opacity: ["disabled"],
      backgroundColor: ["group-focus"],
      textColor: ["group-focus"]
    }
  }
};
