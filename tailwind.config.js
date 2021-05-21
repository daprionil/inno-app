module.exports = {
  purge: [
    './public/*.html',
    './public/**/*.js',
    './public/**/**/*.js'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
       'contab': "url('../img/bg-image.jpg')"
      }),
      colors: {
        orange:{
          "100":'#ff9460',
          "200":'#ff6d2a',
          "300":'#fc5500',
          "400":'#f55000',
          "500":'#ee4a00',
          "600":'#dc4400',
          "700":'#bf3b00'
        },
        cel:{
          "100":'#72ceff',
          "200":'#3abaff',
          "300":'#17aeff',
          "400":'#00a6ff',
          "500":'#0099eb',
          "600":'#0288d0',
          "700":'#0176b5'
        }
      },
      fontFamily:{
        "sans":["'DM Sans'",'sans-serif']
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-textshadow'),
    require('@tailwindcss/line-clamp'),
  ]
}
