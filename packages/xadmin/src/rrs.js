import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory, hashHistory, Router } from 'react-router'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

// redux app
const redux_app = {
  context: (app) => (context, cb) => {

    const enhancers = [
      applyMiddleware(...app.load_list('middlewares')),
      ...app.load_list('store_enhancers')
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
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    // create store
    const store = createStore(
      create_reducers(),
      context['initial_state'] || {},
      composeEnhancers(...enhancers)
    )

    cb(null, { ...context, store })
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
  context: (app) => (context, cb) => {
    // extend store
    const { store } = context
    store.runSaga = sagaMiddleware.run

    // start saga
    const effects = app.load_list('effects')
    effects.forEach(sagaMiddleware.run)
    cb(null, context)
  },
  middlewares: (app) => { return sagaMiddleware }
}

// react & react-router app
const react_app = {
  context: (app) => (context, cb) => {
    app.go = (uri) => {
      app.context.router.push(uri)
    }
    
    const routerType = app.load_dict('config')['router'] || 'browser'
    const router = (typeof routerType === 'string') ? {
      browser: browserHistory,
      hash: hashHistory
    }[routerType] : routerType

    cb(null, { ...context, router })
  },
  start: (app) => () => {
    // init container
    let { container='#app' } = app.context
    if (typeof container === 'string') {
      container = document.querySelector(container)
    }

    const rs = app.load_dict_list('routers')
    const find_childs = (path) => {
      return (rs[path] || []).map((r) => {
        const childs = find_childs((path == '@' ? '' : path) + r.path)
        return childs.length > 0 ? { ...r, childRoutes: [ ...(r.childRoutes||[]), ...childs ] } : r
      })
    }
    const routers = find_childs('@')

    const root = app.load_list('root_component').reduce((children, render) => {
      return render(children)
    }, (routers && routers.length) ?
      <Router history={app.context.router} routes={routers[0]}/> :
      <span>Please config routers or Main component.</span>)

    ReactDOM.render(root, container)
  }
}

// react-redux app
const react_redux_app = {
  root_component: (app) => (children) => (
    <Provider store={app.context.store}>{children}</Provider>
  )
}

export default app => {
  return app.use(redux_app).use(sage_app).use(react_app).use(react_redux_app)
}
