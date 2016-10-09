import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import createSagaMiddleware, { takeEvery, takeLatest } from 'redux-saga'
import { Router, DefaultRoute, browserHistory } from 'react-router'
import { fork } from 'redux-saga/effects'
import invariant from 'invariant'
import warning from 'warning'

class PackageManager {

  constructor() {
    this.apps = []
    this._cache = {}
  }

  load(app) {
    this.apps.push(app)
  }

  get_value(value) {
    if(typeof value == 'function') {
      return value(this)
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

  load_apps_dict(key) {
    const self = this
    return this.load_apps(key, (prev, value) => {
      return { ...prev, ...self.get_value(value) }
    }, {})
  }

  load_apps_list(key) {
    const self = this
    return this.load_apps(key, (prev, value) => {
      return prev.concat(self.get_value(value))
    }, [])
  }

  load_apps_dict_list(key) {
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

  create_reducers() {
    const reducers_map = this.load_apps_dict('reducers')
    let reducers = {}
    for(const key in reducers_map) {
      reducers[key] = this.enhance_reducer(key, reducers_map[key])
    }
    return combineReducers(reducers)
  }

  enhance_reducer(key, reducer) {
    const reducer_enhance = this.load_apps_dict_list('reducer_enhance')
    if(reducer_enhance[key] !== undefined) {
      const reducers = [ reducer, ...reducer_enhance[key] ]
      return (state, action) => {
        reducers.reduce((prev, reducer) => { reducer(prev, action) }, state)
      }
    }
    return reducer
  }

  get_blocks() {
    return this.load_apps_dict_list('blocks')
  }

  get_block(tag) {
    return this.get_blocks()[tag] || []
  }

  start(container, initial_state={}) {
    // init container
    if (typeof container === 'string') {
      container = document.querySelector(container)
      invariant(container, 'app.start: could not query selector: ' + container)
    }

    // create middlewares
    const sagaMiddleware = createSagaMiddleware()
    let middlewares = [
      sagaMiddleware,
      ...this.load_apps_list('middlewares')
    ]
    // if (routerMiddleware) {
    //   middlewares = [routerMiddleware(history), ...middlewares]
    // }
    const devtools = window.devToolsExtension || (() => noop => noop)
    const enhancers = [
      applyMiddleware(...middlewares),
      ...this.load_apps_list('store_enhancers'),
      devtools()
    ]
    
    // create store
    const store = this._store = createStore(
      this.create_reducers(),
      initial_state,
      compose(...enhancers)
    )

    // extend store
    store.runSaga = sagaMiddleware.run
    store.asyncReducers = {}

    // store change
    const listeners = this.load_apps_list('subscribe')
    for (const listener of listeners) {
      store.subscribe(listener)
    }
    this.load_apps_list('on_create_store').forEach((callback) => callback(store))

    // start saga
    const effects = this.load_apps_list('effects')
    effects.forEach(sagaMiddleware.run)

    // get routers
    const routers = this.make_routers()

    // If has container, render; else, return react component
    if (container) {
      this.render(container, store, routers)
    } else {
      return this.get_provider(store, routers)
    }
  }

  make_routers() {
    const rs = this.load_apps_dict_list('routers')
    const find_childs = (path) => {
      return (rs[path] || []).map((r) => {
        const childs = find_childs((path == '@' ? '' : path) + r.path)
        return childs.length > 0 ? { ...r, childRoutes: childs } : r
      })
    }
    return find_childs('@')[0]
  }

  get_provider(store, routers) {
    return () => (
      <Provider store={store}>
        <Router history={browserHistory} routes={routers}/>
      </Provider>
    )
  }

  render(container, store, routers) {
    const ReactDOM = require('react-dom')
    ReactDOM.render(React.createElement(this.get_provider(store, routers)), container)
  }
}

const app = new PackageManager()

const Block = (tag, context) => {
  let exposedProps = context.props || {}
  return app.get_block(tag).map((SubComponent)=>{
    return <SubComponent key={SubComponent.displayName} context={context} {...exposedProps} />
  })
}

module.exports = {
  app,
  Block
}
