import React from 'react'

import { PropTypes, createElement } from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import adapter from './adapter/apicloud'

import thunkMiddleware from 'redux-thunk'
import modelReducer from './reducers'

const modelStores = {}
const modelConfigs = {
  car: {
    title: 'Car',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 3
        },
        color: {
          type: 'string',
          minLength: 3
        },
        count: {
          type: 'number',
          max: 30
        },
        active: {
          type: 'boolean'
        },
        brand: {
          title: 'Car Brand',
          type: 'string',
          enum: [
            'benz',
            'BMW',
            'audi'
          ]
        },
        comment: {
          title: 'Comment',
          type: 'string',
          maxLength: 20,
          validationMessage: 'Don\'t be greedy!',
          description: 'Please write your comment here.'
        },
        createdAt: {
          title: 'Date',
          type: 'date'
        }
      },
      required: [
        'name'
      ]
    },
    form: [
      '*'
    ],
    filters: ['name', 'brand', 'color', 'createdAt'],
    list_display: ['name', 'brand', 'color', 'createdAt']
  }
}

const createModelStore = () => {
  return createStore(modelReducer, {}, compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
}

module.exports.model = (component) => {
  const Model = React.createClass({

    childContextTypes: {
      store: PropTypes.object.isRequired,
      model: PropTypes.object.isRequired
    },

    componentWillMount () {
      this.model = this.getModel()
      let modelName = this.model.name
      if (modelStores[modelName] === undefined) {
        modelStores[modelName] = createModelStore()
      }
      this.store = modelStores[modelName]
    },

    getChildContext () {
      return { store: this.store, model: this.model }
    },

    render () {
      return createElement(component, this.props)
    },

    getModel () {
      const model = this.props.params.model

      return Object.assign({
        name: model,
        $link: {
          list: {
            path: `/model/${model}`
          },
          add: {
            path: `/model/${model}/add`
          },
          get (id) {
            return {
              path: `/model/${model}/${id}`
            }
          },
          edit (id) {
            return {
              path: `/model/${model}/${id}/edit`
            }
          }
        },
        $res: adapter(model)
      }, modelConfigs[model])
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
  }
}
