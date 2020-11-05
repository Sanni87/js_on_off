const path = require('path');

module.exports = {
  //mode: 'development',
  entry: './src/on_off.plugin.js',
  //devtool: 'inline-source-map',
  output: {
    filename: 'on_off.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};