import App from './app'
import rrs from './rrs'
import RESTBaseAPI from './api'
import { Block, BlockTag } from './block'
import { Wrap, StoreWrap, wrap } from './wrap'

const base = {
  items: {
    config: { type: 'map' },
    context: { type: 'array' },
    start: { type: 'array' },
    logger: { type: 'array' },
    blocks: { type: 'mapArray' },
    mappers: { type: 'mapArray' }
  }
}

if(window.__app__ == undefined) {
  window.__app__ = rrs((new App()).use(base))
}
const app = window.__app__

const config = (key, default_value) => {
  return app.get('config')[key] || default_value
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
  StoreWrap,
  wrap
}
