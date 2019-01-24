const path = require('path')
let proxy = {}
try {
  proxy = require('./proxy')
} catch (error) { }

const nodeEnv = process.env.NODE_ENV || 'development'
const isProduction = nodeEnv === 'production'

let server = () => () => {}

if(!isProduction) {
  //server = require('./server')
}

module.exports = {
  type: 'react-app',
  webpack: {
    config: function (config) {
      config['resolve'] = {
        extensions: [ '.js', '.jsx', '.json' ],
        alias: {
          '@': path.resolve('src')
        },
        modules: [ ...config['resolveLoader']['modules'], path.resolve('node_modules') ]
      }
      return config
    },
    rules: {
      graphics: { options: { limit: 1, name: 'assets/imgs/[name].[hash:8].[ext]' } },
      svg: { options: { limit: 1, name: 'assets/svg/[name].[hash:8].[ext]' } },
      jpeg: { options: { limit: 1, name: 'assets/imgs/[name].[hash:8].[ext]' } },
      fonts: { options: { limit: 1, name: 'assets/fonts/[name].[hash:8].[ext]' } },
      video: { options: { limit: 1, name: 'assets/media/[name].[hash:8].[ext]' } },
      audio: { options: { limit: 1, name: 'assets/media/[name].[hash:8].[ext]' } },
      less: { options: { javascriptEnabled: true } },
    },
    uglify: { cache: false, sourceMap: false }
  },
  devServer: {
    before: server,
    proxy: proxy
  }
}
