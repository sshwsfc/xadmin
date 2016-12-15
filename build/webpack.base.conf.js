var path = require('path')
var paths = require('./paths')

module.exports = {
  entry: {
    app: [ 'babel-polyfill', paths.appIndexJs ]
  },
  output: {
    path: paths.appStatic,
    publicPath: '/static/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    fallback: [paths.appNodeModules],
    alias: {
      'src': paths.appSrc
    }
  },
  resolveLoader: {
    fallback: [paths.appNodeModules]
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: [ /node_modules/, /xadmin/ ]
      }
    ],
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
      {test: /\.scss$/, loader: "style-loader!css-loader!sass-loader"},
      {test: /\.css?$/, loader: 'style-loader!css-loader'},
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash:7]'
        }
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  }
}
