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

  get_value(value) {
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

  load_apps(key, load_reducer, init_state = {}) {
    if(this._cache[key] == undefined) {
      this._cache[key] = this.apps.reduce((prev, app) => {
        return app[key] !== undefined ? load_reducer(prev, app[key]) : prev
      } , init_state) || init_state
    }
    return this._cache[key]
  }

  load_dict(key) {
    const self = this
    return this.load_apps(key, (prev, value) => {
      return { ...prev, ...self.get_value(value) }
    }, {})
  }

  load_list(key) {
    const self = this
    return this.load_apps(key, (prev, value) => {
      return prev.concat(self.get_value(value))
    }, [])
  }

  load_dict_list(key) {
    const self = this
    return this.load_apps(key, (prev, value) => {
      const values = self.get_value(value)
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

  start(init_context={}) {
    const self = this

    waterfall([ (cb) => { cb(null, init_context) }, ...this.load_list('context') ],
      (err, context) => {
        self.context = context
        self.load_list('start').forEach((starter) => {
          starter(self)
        })
      })
  }

  log(level, message, error) {
    this.load_list('logger').forEach(logger => logger(level, message, error))
  }

  error(err) {
    this.log('error', err.toString(), err)
  }
}
