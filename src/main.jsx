import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { Router, DefaultRoute, browserHistory } from 'react-router'

import MainApp from './layouts/Main'
import {PM} from './plugin'
import model from './model'
import filter from './plugins/filter'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

PM.loadPlugins(model)
PM.loadPlugins(filter)

PM.ctx['routes'] = []
PM.ctx['reducers'] = []
PM.init()

const routes = {
  path: '/',
  component: MainApp,
  childRoutes: PM.ctx['routes']
}

const loggerMiddleware = createLogger()
if (PM.ctx['reducers'].length > 0) {
  const store = createStore(...PM.ctx['reducers'], {}, compose(
    applyMiddleware(thunkMiddleware, ...(PM.ctx['redux-middleware']||[])),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
}
render(
  <Router history={browserHistory} routes={routes}/>,
  document.getElementById('app')
)
