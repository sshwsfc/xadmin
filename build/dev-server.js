var express = require('express')
var webpack = require('webpack')
var url = require('url')
var config = require('./webpack.dev.conf')
var DashboardPlugin = require('webpack-dashboard/plugin')
var proxy = require('express-http-proxy')
var path = require('path')
var paths = require('./paths')
var argv = require('yargs').argv
var app = express()
var compiler = webpack(config)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

compiler.apply(new DashboardPlugin())

// serve pure static assets
app.use('/static', express.static(paths.appSrcStatic))
// proxy
//app.use('/api', proxy('http://localhost:8000'))
if(argv.proxy) {
  var p = url.parse(argv.proxy)
  app.use('/api', proxy(p.host, { 
    forwardPath: function (req) {
      return p.path + url.parse(req.url).path
    },
    reqBodyEncoding: null 
  }))
}
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())
// serve webpack bundle output
app.use(devMiddleware)
// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

app.listen(parseInt(argv.port || '8080'), function (err) {
  if (err) {
    return
  }
})
