import React from 'react'

import _ from 'lodash'
import { PropTypes, createElement } from 'react'

import { Block, StoreWrap, app } from '../index'
import { Icon } from '../components'

const Model = (modelOrName, props={}) => {
  const { key, persist, initialValues, modelProps } = props
  const ModelComponent = React.createClass({

    contextTypes: {
      store: React.PropTypes.object.isRequired
    },

    childContextTypes: {
      model: PropTypes.object.isRequired
    },

    componentWillMount() {
      const { store } = this.context
      this.model = _.isString(modelOrName) ? this.getModel(modelOrName) : {
        ...modelOrName,
        key: key || modelOrName.name,
        ...modelProps
      }
      store.dispatch({ type: 'INITIALIZE', model: this.model, initial: initialValues })
    },

    componentWillUnmount() {
      if(persist === false) {
        const { store } = this.context
        setTimeout(() => store.dispatch({ type: 'DESTROY', model: this.model }), 500)
      } 
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
        key: key || model.name,
        ...modelProps
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
    return { modelState: store.getState().model[model.key], model }
  },
  computeProps: (tag, { model }) => {
    const ret = { model }
    if(model.components && model.components[tag]) {
      ret['componentClass'] = model.components[tag]
    }
    return ret
  }
})

export default {
  ModelWrap,
  Model
}
