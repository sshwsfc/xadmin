import React from 'react'

import _ from 'lodash'
import { PropTypes, createElement } from 'react'
import adapter from './adapter/apicloud'

import models from './models'
import { Icon } from '../components'

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
      model: PropTypes.object.isRequired
    },

    componentWillMount() {
      this.model = this.getModel(modelName)
    },

    getChildContext() {
      return { model: this.model }
    },

    render() {
      return createElement(component, this.props)
    },

    getModel(name) {
      return Object.assign({
        name: name,
        $link: {
          list: {
            path: `/model/${name}`
          },
          add: {
            path: `/model/${name}/add`
          },
          get(id) {
            return {
              path: `/model/${name}/${id}`
            }
          },
          edit(id) {
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

  componentWillMount() {
    this.model = this.context.model
    this.router = this.context.router
    this.store = this.context.store
  },

  dispatch(action) {
    this.store.dispatch({ model: this.model, ...action })
  },

  componentDidMount() {
    if(typeof this.getStateMap === 'function' && !this.unsubscribe) {
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
    if(this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  },

  getModelState() {
    return this.store.getState().model[this.model.name]
  },

  handleStoreChange() {
    if(!this.unsubscribe) {
      return
    }

    const storeState = this.store.getState().model[this.model.name]
    const newState = this.getStateMap(storeState)
    if(!shallowEqual(newState, this.state)) {
      this.setState(newState)
    }
  },

  getInitialState() {
    if(typeof this.getStateMap === 'function')
      return this.getStateMap(this.context.store.getState().model[this.context.model.name])
    else
      return {}
  }
}
