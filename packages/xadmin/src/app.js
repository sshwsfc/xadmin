import waterfall from 'async/waterfall'

export default class App {

  constructor() {
    this.apps = []
    this.items = {}
    this.context = {}
    this._cache = {}
    this.started = false
  }

  checkAddItems(items) {
    items && Object.keys(items).forEach(key => {
      if(this.items[key] != undefined) {
        throw Error(`Repeatedly defined configuration item '${key}'`)
      } else {
        this.items[key] = items[key]
      }
    })
  }

  use(app) {
    const _app = app.app || app
    if(_app) {
      this.checkAddItems(_app.items)
      this.apps.push(_app)
    }
    return this
  }

  unuse(name) {
    this.apps = this.apps.reduce((prev, app) => {
      if(app.name != name) {
        prev.push(app)
      } else if (app.items) {
        Object.keys(app.items).forEach(key => delete this.items[key])
      }
      return prev
    }, [])
    return this
  }

  items() { this.items }

  getItem(key) {
    const item = this.items[key]
    if(item == undefined) {
      throw Error(`Not defined configuration item '${key}'`)
    }
    return item
  }

  $(key) {
    return this.get(key)
  }

  get(key) {
    const item = this.getItem(key)
    if(item.reducer && item.init) {
      return this.reduce(key, item.reducer, item.init)
    }
    switch (item.type) {
      case 'array':
        return this.array(key)
      case 'mapArray':
        return this.mapArray(key)
      case 'map':
      default:
        return this.map(key)
    }
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
    if(!this.started) {
      throw Error('App not started, can\'t use app item.')
    }
    if(this._cache[key] == undefined) {
      this._cache[key] = this.apps.reduce((prev, app) => {
        return app[key] !== undefined ? load_reducer(prev, app[key]) : prev
      } , init_state) || init_state
    }
    return this._cache[key]
  }

  map(key) {
    return this.reduce(key, (prev, value) => {
      return { ...prev, ...this.getValue(value) }
    }, {})
  }

  array(key) {
    return this.reduce(key, (prev, value) => {
      return prev.concat(this.getValue(value))
    }, [])
  }

  mapArray(key) {
    return this.reduce(key, (prev, value) => {
      const values = this.getValue(value)
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

  config(key) {
    return this.get('config')[key]
  }

  start(init_context={}) {
    const self = this
    this.started = true

    waterfall([ (cb) => { cb(null, init_context) }, 
      ...this.get('context')
        .map(func => (context, cb) => func(context, (err, newContext) => {
          self.context = newContext
          cb(err, newContext)
        })) ],
    (err, context) => {
      self.context = context
      self.get('start').forEach((starter) => {
        starter(self)
      })
    })
  }

  log(level, message, error) {
    this.get('logger').forEach(logger => logger(level, message, error))
  }

  error(err) {
    this.log('error', err.toString(), err)
  }
}
