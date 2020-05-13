import React from 'react'
import _ from 'lodash'
import { Block, StoreWrap, app, use } from 'xadmin'
import reducers from './reducers'

const ModelContext = React.createContext(null)
const ModelStateContext = React.createContext(null)

const getModel = (name, key, props) => {
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

const Model = ({ name, schema, modelKey, initialValues, children, props: modelProps }) => {

  const model = React.useMemo(() => {
    return name ? getModel(name, modelKey, modelProps) : {
      ...schema,
      key: modelKey || schema.name,
      ...modelProps
    }
  }, [ name, schema, modelKey ])

  return <ModelProvider model={model} initialValues={initialValues}>{children}</ModelProvider>
}

const ModelProvider = ({ model, initialValues, children }) => {
  const stateRef = React.useRef(null)
  const [ state, dispatch ] = React.useReducer(reducers, {}, () => {
    let initial = initialValues || {}
    if(!initial && model.initialValues) {
      initial = _.isFunction(model.initialValues) ? model.initialValues() : model.initialValues
    }
    return reducers(initial, { type: 'INITIALIZE', model })
  })
  stateRef.current = state

  const getState = React.useCallback(() => stateRef.current, [])

  return (
    <ModelContext.Provider value={{ model, getState, dispatch }}>
      <ModelStateContext.Provider value={state}>
        {children}
      </ModelStateContext.Provider>
    </ModelContext.Provider>
  )
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
    { ({ model }) => (
      <Block model={model} {...props} >
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
  ModelStateContext,
  ModelWrap,
  ModelBlock,
  Model
}
