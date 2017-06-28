const fs = require('fs')
const webpack = require('webpack')
const babelrc = JSON.parse(fs.readFileSync('.babelrc', 'utf-8'))

require('dotenv').config()

module.exports = {
  entry: [
    'babel-polyfill',
    './source/javascripts/main.js'
  ],
  resolve: {
    extensions: ['.jsx', '.js']
  },
  output: {
    path: __dirname + '/.tmp/dist/javascripts',
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: babelrc
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.ALGOLIA_APP_ID': JSON.stringify(process.env.ALGOLIA_APP_ID),
      'process.env.ALGOLIA_API_KEY': JSON.stringify(process.env.ALGOLIA_API_KEY),
      'process.env.ALGOLIA_INDEX': JSON.stringify(process.env.ALGOLIA_INDEX),
    })
  ]
}
