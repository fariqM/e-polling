const CopyPlugin = require("copy-webpack-plugin");
const fs = require('fs');

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: "others", to: "" },
        ],
      }),

    ],
  },
  transpileDependencies: [
    'vuetify'
  ],
  // devServer: {
  //   https: {
  //     key: fs.readFileSync('./cert/laragon.key'),
  //     cert: fs.readFileSync('./cert/laragon.crt'),
  //   },
  //   // public: 'https://localhost:8080/'
  // }
})
