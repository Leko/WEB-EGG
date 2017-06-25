const fs = require('fs')
const babelrc = JSON.parse(fs.readFileSync('.babelrc', 'utf-8'))

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
  }
}
