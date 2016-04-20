import React from 'react'

import _ from 'lodash'
import { PropTypes, createElement } from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import adapter from './adapter/apicloud'

import thunkMiddleware from 'redux-thunk'
import modelReducer from './reducers'
import models from './models'
import { Icon } from '../components'

const modelStores = {}

const initStore = (model) => {
  return {filter: {fields: [].concat(model.list_display), limit: 50, skip: 0}}
}

const createModelStore = (model) => {
  return createStore(modelReducer, initStore(model), compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
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


module.exports.model = (modelName, component) => {
  const Model = React.createClass({

    childContextTypes: {
      store: PropTypes.object.isRequired,
      model: PropTypes.object.isRequired
    },

    componentWillMount () {
      this.model = this.getModel(modelName)
      if (modelStores[modelName] === undefined) {
        modelStores[modelName] = createModelStore(this.model)
      }
      this.store = modelStores[modelName]
    },

    getChildContext () {
      return { store: this.store, model: this.model }
    },

    render () {
      return createElement(component, this.props)
    },

    getModel (name) {
      return Object.assign({
        name: name,
        icon: () => {
          return <Icon name={this.name} />
        },
        $link: {
          list: {
            path: `/model/${name}`
          },
          add: {
            path: `/model/${name}/add`
          },
          get (id) {
            return {
              path: `/model/${name}/${id}`
            }
          },
          edit (id) {
            return {
              path: `/model/${name}/${id}/edit`
            }
          }
        },
        $res: adapter(name)
      }, models[name])
    }
  })

  return Model
}

module.exports.ModelMixin = {
  contextTypes: {
    router: React.PropTypes.object.isRequired,
    model: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
  },

  componentWillMount () {
    this.model = this.context.model
    this.router = this.context.router
    this.store = this.context.store
    this.dispatch = this.store.dispatch
  },

  componentDidMount() {
    if (typeof this.getStateMap === 'function' && !this.unsubscribe) {
      this.unsubscribe = this.store.subscribe(this.handleStoreChange)
    }
  },

  componentWillUnmount() {
    this.tryUnsubscribe()
  },

  isSubscribed() {
    return typeof this.unsubscribe === 'function'
  },

  tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  },

  handleStoreChange() {
    if (!this.unsubscribe) {
      return
    }

    const storeState = this.store.getState()
    const newState = this.getStateMap(storeState)
    if (!shallowEqual(newState, this.state)) {
      this.setState(newState)
    }
  },

  getInitialState () {
    if (typeof this.getStateMap === 'function')
      return this.getStateMap(this.context.store.getState())
    else
      return {}
  }
}
