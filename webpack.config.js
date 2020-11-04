const path = require('path');

module.exports = {
  entry: './src/on_off.plugin.js',
  output: {
    filename: 'on_off.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};