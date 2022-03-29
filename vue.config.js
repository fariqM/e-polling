const CopyPlugin = require("copy-webpack-plugin");
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: "others", to: "" },
        ],
      }),
    ]
  },
  transpileDependencies: [
    'vuetify'
  ]
})
