import App from './app'
import rrs from './rrs'
import RESTBaseAPI from './api'
import { Block } from './block'

const base = {
  items: {
    config: { type: 'map' },
    context: { type: 'array' },
    start: { type: 'array' },
    logger: { type: 'array' },
    blocks: { type: 'mapArray' },
    mappers: { type: 'mapArray' },
    hooks: { type: 'mapArray' }
  }
}

if(window.__app__ == undefined) {
  window.__app__ = rrs((new App()).use(base))
}
const app = window.__app__

const config = (key, default_value) => {
  return app.get('config')[key] || default_value
}

const api = (opt) => {
  const API = config('api')
  if (API) {
    return new API(opt)
  } else {
    throw 'App API not implement!!!'
  }
}

const use = (key, ...args) => {
  const hooks = app.get('hooks')[key] || []
  let runHook = null
  hooks.forEach(hook => {
    if(hook.extend == true) {
      runHook = hook(runHook)
    } else {
      runHook = hook
    }
  })
  return runHook ? runHook(...args) : {}
}

export default app
export {
  app,
  api,
  config,
  use,
  RESTBaseAPI,
  Block
}
