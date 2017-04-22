var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, '..'),
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, '../.tmp'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          },
          'sass-loader'
        ]
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin('[name]-[hash].css'),
    new HtmlPlugin({
      template: './src/index.html',
      minify: false
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../src/assets'),
    port: 3000
  }
};