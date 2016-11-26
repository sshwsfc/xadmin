import React from 'react'

import _ from 'lodash'
import { PropTypes, createElement } from 'react'
import adapter from './adapter'

import { Block, StoreWrap, app } from '../index'
import { Icon } from '../components'

const Model = (modelName) => {

  const ModelComponent = React.createClass({

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
      return this.props.children
    },

    getModel(name) {
      const model = app.load_dict('models')[name]
      model.name = model.name || name
      return model ? {
        ...model,
        $link: {
          list: {
            path: `/model/${name}/list`
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
        $api: adapter(model)
      } : null
    }
  })

  return ModelComponent
}

const ModelWrap = StoreWrap({
  contextTypes: {
    model: React.PropTypes.object.isRequired
  },
  getState: (context) => {
    const { store, model } = context
    return { modelState: store.getState().model[model.name], model }
  },
  computeProps: (tag, { model }) => {
    if(model.components && model.components[tag]) {
      return { componentClass: model.components[tag] }
    }
  }
})

export default {
  ModelWrap,
  Model
}
