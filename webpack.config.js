var webpack = require('webpack');
var path = require('path');
//var nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  context: __dirname,
  devServer: {
    contentBase: __dirname
  },
  entry: {
    form: './src/main.jsx'
  },
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      // Use uncompiled version
      //'react-schema-form': '../src'
    }
  },
  module: {
      loaders: [

          {
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              presets: ['es2015', 'react']
            }
          },
          {test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
          {test: /\.css?$/, loader: 'style-loader!css-loader'},
          {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
      ]
  }
};