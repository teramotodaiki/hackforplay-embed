const path = require('path');
module.exports = {
  entry: {
    game: './src/game'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js'
  }
};
