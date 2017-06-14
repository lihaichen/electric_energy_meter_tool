require('babel-polyfill');
const path = require('path');
const webpack = require('webpack');
const assetsPath = path.resolve(__dirname, '../static/node');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  target: 'electron-main',
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
  }
};
