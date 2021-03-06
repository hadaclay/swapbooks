const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const javascript = {
  test: /\.(js)$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            'env',
            {
              targets: {
                browser: ['last 3 versions', 'safari >= 7']
              },
              useBuiltIns: true
            }
          ]
        ]
      }
    }
  ]
};

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() {
      return [autoprefixer({ browsers: 'last 3 version' })];
    }
  }
};

const styles = {
  test: /\.(scss)$/,
  use: ExtractTextPlugin.extract(['css-loader', postcss, 'sass-loader'])
};

const config = {
  entry: {
    App: './public/javascripts/swapbooks-app.js'
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [javascript, styles]
  },
  plugins: [new ExtractTextPlugin('style.css')]
};
process.noDeprecation = true;

module.exports = config;
