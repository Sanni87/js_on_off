const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    min: './src/on_off.plugin.js',
    module: './src/on_off.module.js'
  },
  devtool: 'inline-source-map',
  output: {
    filename: 'on_off.[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};