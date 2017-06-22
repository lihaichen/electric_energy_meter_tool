require('babel-polyfill');
const path = require('path');
const webpack = require('webpack');
const assetsPath = path.resolve(__dirname, '../static/node');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const contextPath = path.resolve(__dirname, '..');
module.exports = {
  devtool: 'source-map',
  target: 'electron-main',
  context: contextPath,
  entry: {
    main: [
      './node/main.js'
    ],
  },
  output: {
    path: assetsPath,
    filename: `node.js`,
  },
  plugins: [
    new CleanWebpackPlugin(['node'], {root: assetsPath, exclude: ['images']}),
  ],
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, '../node_modules')],
    extensions: ['.web.js', '.js', '.json', '.jsx'],
  }
};
