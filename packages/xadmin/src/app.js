import waterfall from 'async/waterfall'

export default class App {

  constructor() {
    this.apps = []
    this.context = {}
    this._cache = {}
  }

  use(app) {
    this.apps.push(app.app || app)
    return this
  }

  unuse(name) {
    this.apps = this.apps.filter(app => app.name != name)
    return this
  }

  getValue(value) {
    if(typeof value == 'function' && value.length == 1) {
      if(value.constructor.name == 'GeneratorFunction') {
        const it = value(this)
        const go = (result) => {
          if (result.done) return result.value
          return result.value.then((v) => {
            return go(it.next(v))
          }, (error) => {
            return go(it.throw(error))
          })
        }
        return it
      } else {
        return value(this)
      }
    } else {
      return value
    }
  }

  reduce(key, load_reducer, init_state = {}) {
    if(this._cache[key] == undefined) {
      this._cache[key] = this.apps.reduce((prev, app) => {
        return app[key] !== undefined ? load_reducer(prev, app[key]) : prev
      } , init_state) || init_state
    }
    return this._cache[key]
  }

  map(key) {
    const self = this
    return this.reduce(key, (prev, value) => {
      return { ...prev, ...self.getValue(value) }
    }, {})
  }

  array(key) {
    const self = this
    return this.reduce(key, (prev, value) => {
      return prev.concat(self.getValue(value))
    }, [])
  }

  mapArray(key) {
    const self = this
    return this.reduce(key, (prev, value) => {
      const values = self.getValue(value)
      for(const key in values) {
        prev[key] = (prev[key] || [])
        const com_value = values[key]
        if(Array.isArray(com_value)) {
          prev[key] = prev[key].concat(com_value)
        } else {
          prev[key].push(com_value)
        }
      }
      return prev
    }, {})
  }
  
  load_dict(key) {
    return this.map(key)
  }

  load_list(key) {
    return this.array(key)
  }

  load_dict_list(key) {
    return this.mapArray(key)
  }

  start(init_context={}) {
    const self = this

    waterfall([ (cb) => { cb(null, init_context) }, 
      ...this.array('context')
        .map(func => (context, cb) => func(context, (err, newContext) => {
          self.context = newContext
          cb(err, newContext)
        })) ],
    (err, context) => {
      self.context = context
      self.array('start').forEach((starter) => {
        starter(self)
      })
    })
  }

  log(level, message, error) {
    this.array('logger').forEach(logger => logger(level, message, error))
  }

  error(err) {
    this.log('error', err.toString(), err)
  }
}
