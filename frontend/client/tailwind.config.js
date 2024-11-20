const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-background': "url('/public/assets/images/background.png')",
        'background-home': "url('/public/assets/images/banner.jpg')",
        // 'avatar-default': "url('/public/assets/images/avatar-default.jpg')",
      },

    },
  },
  plugins: [],
});