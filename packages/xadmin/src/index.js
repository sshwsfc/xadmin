import App from './app'
import rrs from './rrs'
import RESTBaseAPI from './api'
import { Block, BlockTag } from './block'
import { Wrap, StoreWrap } from './wrap'

if(window.__app__ == undefined) {
  window.__app__ = rrs(new App())
}
const app = window.__app__

const config = (key, default_value) => {
  return app.load_dict('config')[key] || default_value
}

const API_CACHE = {}

const api = (opt) => {
  const resource = opt.resource_name || opt.name
  if(API_CACHE[resource] == undefined) {
    const API = config('api')
    if (API) {
      API_CACHE[resource] = new API(opt)
    } else {
      throw 'App API not implement!!!'
    }
  }
  return API_CACHE[resource]
}

export default app
export {
  app,
  api,
  config,
  RESTBaseAPI,
  Block,
  Wrap,
  StoreWrap
}
