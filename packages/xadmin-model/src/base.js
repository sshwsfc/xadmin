import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Block, StoreWrap, app } from 'xadmin'

const ModelContext = React.createContext(null)

class Model extends React.Component {

  constructor(props) {
    super(props)
    const { name, schema, modelKey, initialValues, props: modelProps } = props

    const model = name ? this.getModel(name, modelKey, modelProps) : {
      ...schema,
      key: modelKey || schema.name,
      ...modelProps
    }
    let initial = initialValues
    if(!initial && model.initialValues) {
      initial = _.isFunction(model.initialValues) ? model.initialValues() : model.initialValues
    }
    app.context.store.dispatch({ type: 'INITIALIZE', model, initial })
    this.state = { model }
  }

  getModel(name, key, props) {
    const model = app.get('models')[name]
    if(!model) {
      throw Error(`Model '${name}' not found!`)
    }
    model.name = model.name || name
    return {
      ...model,
      key: key || model.name,
      ...props
    }
  }

  render() {
    return <ModelContext.Provider value={this.state.model}>{this.props.children}</ModelContext.Provider>
  }
}

const ModelWrap = StoreWrap(Connect => (props) => {
  const { state } = props.wrapContext
  return (
    <ModelContext.Consumer>
      { model => <Connect {...props} model={model} wrapContext={{ ...props.wrapContext, model, modelState: state.model[model.key] }} /> }
    </ModelContext.Consumer>
  )
})

const ModelBlock = (props) => (
  <ModelContext.Consumer>
    { model => (
      <Block {...props} >
        { blocks => {
          const modelBlock = model && model.blocks && model.blocks[props.name]
          if(modelBlock) {
            const mb = modelBlock(props)
            blocks = blocks ? [ mb, ...blocks ] : [ mb ]
          }
          return props.children ? props.children(blocks) : blocks
        } }
      </Block>
    ) }
  </ModelContext.Consumer>
)

export {
  ModelContext,
  ModelWrap,
  ModelBlock,
  Model
}
