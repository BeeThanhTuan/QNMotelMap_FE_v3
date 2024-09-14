/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'ml': '900px', // Thay đổi breakpoint cho màn hình nhỏ hơn 900px
      },
      maxWidth: {
        'custom': '1140px', // max width
      },
      colors: {
        'custom-color-black-light': '#535353', // color màu chữ đen nhạt
        'custom-color-black': '#343334', // color màu chữ đen đậm
        'custom-bg-blue': '#003B95', // background color header
        'custom-color-blue': '#006CE4', // color đăng nhập đăng kí
        'custom-color-blue-light': '#006ce2', // color đăng nhập đăng kí
        'custom-hv-color-blue': '#f3fbff', // background color đăng nhập đăng kí khi hover
      },
      fontFamily: {
        sans: ['"Blue Sans"', 'BlinkMacSystemFont', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      
    },
  },
  plugins: [],
}

