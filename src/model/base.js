import React from 'react'

import _ from 'lodash'
import { PropTypes, createElement } from 'react'
import adapter from './adapter/apicloud'

import { Block, StoreWrap } from '../index'
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

module.exports.ModelWrap = StoreWrap({
  contextTypes: {
    model: React.PropTypes.object.isRequired
  },
  getState: (context) => {
    const { store, model } = context
    return { modelState: store.getState().model[model.name], model }
  }
})
