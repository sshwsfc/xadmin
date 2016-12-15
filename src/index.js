import React from 'react'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import createSagaMiddleware, { takeEvery, takeLatest } from 'redux-saga'
import { Router, DefaultRoute, browserHistory } from 'react-router'
import { fork } from 'redux-saga/effects'
import isPlainObject from 'lodash/isPlainObject'
import hoistStatics from 'hoist-non-react-statics'
import invariant from 'invariant'
import warning from 'warning'

class App {

  constructor() {
    this.apps = []
    this.context = {}
    this._cache = {}
  }

  use(app) {
    this.apps.push(app.app || app)
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
    this.context = this.load_list('context').reduce((prev, creater) => {
      return { ...prev, ...creater(prev, self) }
    }, init_context)

    this.load_list('start').forEach((starter) => {
      starter(self)
    })
  }
}

// redux app
const redux_app = {
  context: (app) => (prev) => {

    const devtools = window.devToolsExtension || (() => noop => noop)
    const enhancers = [
      applyMiddleware(...app.load_list('middlewares')),
      ...app.load_list('store_enhancers'),
      devtools()
    ]

    const enhance_reducer = (key, reducer) => {
      const reducer_enhance = app.load_dict_list('reducer_enhance')
      if(reducer_enhance[key] !== undefined) {
        const reducers = [ reducer, ...reducer_enhance[key] ]
        return (state, action) => {
          return reducers.reduce((prev, reducer) => reducer(prev, action), state)
        }
      }
      return reducer
    }

    const combine_reducer = (key, reducers) => {
      if(reducers.length > 1) {
        return (state, action) => {
          return reducers.reduce((prev, reducer) => reducer(prev, action) , state)
        }
      } else {
        return reducers[0]
      }
    }
    
    const create_reducers = () => {
      const reducers_map = app.load_dict_list('reducers')
      let reducers = {}
      for(const key in reducers_map) {
        reducers[key] = combine_reducer(key, reducers_map[key])
      }
      return combineReducers(reducers)
    }

    // create store
    const store = createStore(
      create_reducers(),
      prev['initial_state'] || {},
      compose(...enhancers)
    )

    return { store }
  },
  start: (app) => () => {
    // store change
    const { store } = app.context
    const listeners = app.load_list('subscribe')
    for (const listener of listeners) {
      store.subscribe(listener)
    }
    app.load_list('on_create_store').forEach((callback) => callback(store))
  }
}

// saga app
const sagaMiddleware = createSagaMiddleware()
const sage_app = {
  start: (app) => () => {
    // extend store
    const { store } = app.context
    store.runSaga = sagaMiddleware.run

    // start saga
    const effects = app.load_list('effects')
    effects.forEach(sagaMiddleware.run)
  },
  middlewares: (app) => { return sagaMiddleware }
}

// react & react-router app
const react_app = {
  context: (app) => (prev) => {
    app.go = (uri) => {
      browserHistory.push(uri)
    }
    return { router: browserHistory }
  },
  start: (app) => () => {
    // init container
    let { container } = app.context
    if (typeof container === 'string') {
      container = document.querySelector(container)
      invariant(container, 'app.start: could not query selector: ' + container)
    }

    const rs = app.load_dict_list('routers')
    const find_childs = (path) => {
      return (rs[path] || []).map((r) => {
        const childs = find_childs((path == '@' ? '' : path) + r.path)
        return childs.length > 0 ? { ...r, childRoutes: [ ...(r.childRoutes||[]), ...childs ] } : r
      })
    }
    const routers = find_childs('@')[0]

    const ReactDOM = require('react-dom')
    const RootComponent = app.load_list('root_component').reduce((PrevComponent, render) => {
      return render(PrevComponent)
    }, () => <Router history={browserHistory} routes={routers}/>)

    ReactDOM.render(<RootComponent />, container)
  }
}

// react-redux app
const react_redux_app = {
  root_component: (app) => (PrevComponent) => {
    const { store } = app.context
    return () => (
      <Provider store={store}><PrevComponent /></Provider>
    )
  }
}


if(window.__app == undefined) {
  window.__app = new App()
  window.__app.use(redux_app).use(sage_app).use(react_app).use(react_redux_app)
}
const app = window.__app

const Block = (tag, element) => {
  const blocks = app.load_dict_list('blocks')
  if(blocks[tag] !== undefined) {
    return blocks[tag].reduce((prev, block) => {
      const ret = block({ nodes: prev, ...element.props })
      if(ret !== undefined && ret != prev) {
        if(Array.isArray(ret)) {
          prev = prev.concat(ret)
        } else {
          prev.push(ret)
        }
      }
      return prev
    }, [])
  }
}

const BlockTag = (props) => {
  const { tag, children } = props
  const blocks = app.load_dict_list('blocks')[tag]
  if(children !== undefined) {
    if(blocks !== undefined) {
      return blocks.reduce((prev, SubComponent)=>{
        return <SubComponent key={SubComponent.displayName} {...props}>{prev}</SubComponent>
      }, children)
    } else {
      return children
    }
  } else {
    if(blocks !== undefined) {
      return blocks.map((SubComponent)=>{
        return <SubComponent key={SubComponent.displayName} {...props} />
      })
    }
  }
}

// Helps track hot reloading.
let nextVersion = 0

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const shallowEqual = (objA, objB) => {
  if (objA === objB) {
    return true
  }
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }
  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        objA[keysA[i]] !== objB[keysA[i]]) {
      return false
    }
  }
  return true
}

const _wrap_component = (tag, WrappedComponent, wrappers) => {
  const connectDisplayName = `Connect(${getDisplayName(WrappedComponent)})`
  // Helps track hot reloading.
  const version = nextVersion++

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)
      this.version = version
      this.stateContext = this.getState()
      this.clearCache()

      this.trySubscribe()
    }

    getState() {
      const context = this.context
      return wrappers.reduce((prev, wrapper) => {
        if(wrapper.getState !== undefined) {
          return { ...prev, ...wrapper.getState(context) }
        } else {
          return prev
        }
      }, {})
    }

    isSubscribed() {
      return isPlainObject(this.unsubscribe)
    }

    trySubscribe() {
      if (!this.unsubscribe) {
        const callback = this.handleChange.bind(this)
        const context = this.context
        this.unsubscribe = wrappers.reduce((prev, wrapper) => {
          if(wrapper.subscribe !== undefined) {
            return { ...prev, ...wrapper.subscribe(context, callback) }
          } else {
            return prev
          }
        }, {})
        //this.handleChange()
      }
    }

    tryUnsubscribe() {
      if (this.unsubscribe) {
        const unsubscribe = this.unsubscribe
        wrappers.forEach((wrapper) => {
          if(wrapper.unsubscribe !== undefined) {
            wrapper.unsubscribe(unsubscribe)
          }
        })
        this.unsubscribe = null
      }
    }

    componentDidMount() {
      this.getMappers().forEach(mapper => {
        if(mapper.event && mapper.event.mount) {
          this.runBindMethod(mapper.event.mount)
        }
      })
    }

    componentWillUnmount() {
      this.tryUnsubscribe()
      this.getMappers().forEach(mapper => {
        if(mapper.event && mapper.event.unmount) {
          this.runBindMethod(mapper.event.unmount)
        }
      })
      this.clearCache()
    }

    componentWillReceiveProps(nextProps) {
      if(shallowEqual(nextProps, this.props)) {
        return
      }
      this.getMappers().forEach(mapper => {
        if(mapper.event && mapper.event.receiveProps) {
          this.runBindMethod(mapper.event.receiveProps, nextProps)
        }
      })
    }

    clearCache() {
      this.methodProps = null
      this.dataProps = null
      this.computeProps = null
      this.wrapProps = null
      this.mappers = null
    }

    getMappers() {
      if(this.mappers == null) {
        this.mappers = app.load_dict_list('mappers')[tag] || []
      }
      return this.mappers
    }

    computeDataProps() {
      const { stateContext, props } = this
      return this.getMappers().reduce((prev, mapper) => {
        if(mapper.data === undefined) {
          return prev
        }
        return { ...prev, ...mapper.data(stateContext, props, prev) }
      }, this.dataProps || {})
    }

    computeComputeProps() {
      const { stateContext, props } = this
      return this.getMappers().reduce((prev, mapper) => {
        if(mapper.compute === undefined) {
          return prev
        }
        return { ...prev, ...mapper.compute(stateContext, { ...props, ...this.dataProps }, prev) }
      }, this.computeProps || {})
    }

    computeWrapProps() {
      const { stateContext, props } = this
      return wrappers.reduce((prev, wrapper) => {
        if(wrapper.computeProps === undefined) {
          return prev
        }
        return { ...prev, ...wrapper.computeProps(tag, stateContext, { ...props, ...this.dataProps }, prev) }
      }, this.wrapProps || {})
    }

    runBindMethod(method, args) {
      const { stateContext, props } = this
      return method(stateContext, props, args)
    }

    computeMethodProps() {
      const bindMethod = this.runBindMethod.bind(this)
      return this.getMappers().reduce((prev, mapper) => {
        if(mapper.method === undefined) {
          return prev
        }
        const methods = mapper.method
        let bindMethods = {}
        for(let key in methods) {
          const method = methods[key]
          bindMethods[key] = (e) => {
            return bindMethod(method)(e)
          }
        }
        return { ...prev, ...bindMethods }
      }, {})
    }

    updateDataProps() {
      const nextDataProps = this.computeDataProps()
      if (this.dataProps && shallowEqual(nextDataProps, this.dataProps)) {
        return false
      }
      this.dataProps = nextDataProps
      return true
    }

    handleChange() {
      if (!this.unsubscribe) {
        return
      }
      const newState = this.getState()
      if (shallowEqual(newState, this.stateContext)) {
        return
      }
      this.stateContext = newState

      const haveDataPropsChanged = this.updateDataProps()
      if(haveDataPropsChanged) {
        this.forceUpdate()
      }
    }

    render() {
      if(this.dataProps == null) {
        this.dataProps = this.computeDataProps()
      }
      this.computeProps = this.computeComputeProps()
      if(this.methodProps == null) {
        this.methodProps = this.computeMethodProps()
      }
      if(this.wrapProps == null) {
        this.wrapProps = this.computeWrapProps()
      }
      return React.createElement(WrappedComponent,
        { ...this.props, ...this.wrapProps, ...this.methodProps, ...this.dataProps, ...this.computeProps }
      )
    }
  }

  Connect.displayName = connectDisplayName
  Connect.WrappedComponent = WrappedComponent
  Connect.contextTypes = wrappers.reduce((prev, wrapper) => {
    return { ...prev, ...wrapper.contextTypes }
  }, {})

  if (process.env.NODE_ENV !== 'production') {
    Connect.prototype.componentWillUpdate = function componentWillUpdate() {
      if (this.version === version) {
        return
      }
      // We are hot reloading!
      this.version = version
      this.trySubscribe()
      this.clearCache()
    }
  }

  return hoistStatics(Connect, WrappedComponent)
}

const _wrap = (magic, wrappers=[]) => {
  if(isPlainObject(magic)) {
    return (arg) => { return _wrap(arg, [ ...wrappers, magic ]) }
  } else {
    return (component) => {
      return _wrap_component(magic, component, wrappers)
    }
  }
}

const Wrap = _wrap({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getState: (context) => {
    const { router } = context
    return { router }
  }
})

const StoreWrap = Wrap({
  contextTypes: {
    store: React.PropTypes.object.isRequired
  },
  getState: (context) => {
    const { store } = context
    return { state: store.getState(), dispatch: store.dispatch }
  },
  subscribe: (context, callback) => {
    const { store } = context
    return { store: store.subscribe(callback) }
  },
  unsubscribe: (unsubscribe) => {
    unsubscribe['store']()
  }
})

const config = (key, default_value) => {
  return app.load_dict('config')[key] || default_value
}

export default {
  app,
  config,
  Block,
  Wrap,
  StoreWrap
}
