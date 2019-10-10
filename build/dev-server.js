require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
// var i18n = require('i18n')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)
// Configuration

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')({
  rewrites: [
    // { from: /\/whitepaper_language\/$/, to: '/whitepaper_language/index.html'},
    // { from: /\/business_overview_language\/$/, to: '/business_overview_language/index.html'},
    { from: /\/roadmap\/$/, to: '/roadmap/index.html'},
    { from: /\/jpn\/roadmap\//, to: '/jpn/roadmap/index.html'},
    { from: /\/chn\/roadmap\//, to: '/chn/roadmap/index.html'},
    { from: /\/kor\/roadmap\//, to: '/kor/roadmap/index.html'},
    { from: /\/de\/roadmap\//, to: '/de/roadmap/index.html'},
    { from: /\/kor\/token\//, to: '/kor/token/index.html'},
    { from: /\/jpn\/token\//, to: '/jpn/token/index.html'},
    { from: /\/chn\/token\//, to: '/chn/token/index.html'},
    { from: /\/de\/token\//, to: '/de/token/index.html'},
    { from: /\/de\/docs\//, to: '/de/docs/index.html'},
    { from: /\/de\/team\//, to: '/de/team/index.html'},
    { from: /\/de\/faq\//, to: '/de/faq/index.html'},
    { from: /\/de\/contacts\//, to: '/de/contacts/index.html'},
    { from: /\/contacts\/$/, to: '/contacts/index.html'},
    { from: /\/faq\/$/, to: '/faq/index.html'},
    { from: /\/binance-exchange\/$/, to: '/binance-exchange/index.html'},
    { from: /\/competition\/$/, to: '/competition/index.html'},
    { from: /\/idnow-success\/$/, to: '/idnow-success/index.html'},
    { from: /\/idnow-test-success\/$/, to: '/idnow-test-success/index.html'},
    { from: /\/registration\/$/, to: '/registration/index.html'},
    { from: /\/token\/$/, to: '/token/index.html'},
    { from: /\/jpn\/$/, to: '/jpn/index.html'},
    { from: /\/ru\/$/, to: '/ru/index.html'},
    { from: /\/de\/$/, to: '/de/index.html'},
    { from: /\/chn\/$/, to: '/chn/index.html'},
    { from: /\/team\/$/, to: '/team/index.html'},
    { from: /\/docs\/$/, to: '/docs/index.html'},
    { from: /\/career\/$/, to: '/career/index.html'},
    { from: /\/career__node\/$/, to: '/career__node/index.html'},
    { from: /\/career__front\/$/, to: '/career__front/index.html'},
    { from: /\/career__design\/$/, to: '/career__design/index.html'},
    { from: /\/kor\/$/, to: '/kor/index.html'}
  ]
}))

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
