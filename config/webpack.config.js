const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const webpack = require('webpack');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.[contenthash].js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // npm install url-loader --save-dev
      {
        test: /\.(gif|png|avif|jpe?g|JPE?G)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/'
            }
          }
        ]
      },

    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "body",
      publicPath: "./"
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
}