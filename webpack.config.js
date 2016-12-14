'use strict'
var webpack = require('webpack')

var env = process.env.NODE_ENV

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
}

var reduxExternal = {
  root: 'Redux',
  commonjs2: 'redux',
  commonjs: 'redux',
  amd: 'redux'
}

var reactReduxExternal = {
  root: 'ReactRedux',
  commonjs2: 'react-redux',
  commonjs: 'react-redux',
  amd: 'react-redux'
}

var reactBootstrapExternal = {
  root: 'ReactBootsctrap',
  commonjs2: 'react-bootstrap',
  commonjs: 'react-bootstrap',
  amd: 'react-bootstrap'
}

var config = {
  externals: {
    'react': reactExternal,
    'redux': reduxExternal,
    'react-redux': reactReduxExternal,
    'react-bootstrap': reactBootstrapExternal
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'Xadmin',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
  config.plugins.push(new webpack.optimize.DedupePlugin())
}

module.exports = config