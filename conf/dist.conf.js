var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, '..'),
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
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
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')({
                    browsers: ['last 2 versions', '> 5%']
                  })
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
      template: './src/index.html'
    }),
    new UglifyJSPlugin(),
    new CopyPlugin([{
      from: './src/assets',
      to: './'
    }])
  ]
};