const path = require('path');
const webpack = require('webpack');

const config = {
  entry: {
    game: './src/game',
    "game.min": './src/game'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel"],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  devServer: {
    contentBase: 'public'
  },
};

if (process.env.NODE_ENV === 'production') {
  const uglify = new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  });
  config.plugins.push(uglify);
}

module.exports = config;
