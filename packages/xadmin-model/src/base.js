import React from 'react'
import _ from 'lodash'
import { Block, StoreWrap, app, use } from 'xadmin'
import { C } from 'xadmin-ui'
import { Routes, Route } from "react-router-dom"

import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
} from 'recoil'

const ModelContext = React.createContext(null)

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
  const { dispatch } = use('redux')
  const [ state, setState ] = React.useState(null)

  const model = React.useMemo(() => {
    return name ? getModel(name, modelKey, modelProps) : {
      ...schema,
      key: modelKey || schema.name,
      ...modelProps
    }
  }, [ name, schema, modelKey ])

  React.useEffect(() => {
    setState(null)
    return () => {
      if(model.persistent != true) {
        setState('DESTROY')
      }
    }
  }, [ model ])

  React.useEffect(() => {
    if(state == null) {
      let initial = initialValues
      if(!initial && model.initialValues) {
        initial = _.isFunction(model.initialValues) ? model.initialValues() : model.initialValues
      }
      dispatch({ type: 'INITIALIZE', model, initial })
      setState('INITIALIZE')
    } else if(state == 'DESTROY') {
      dispatch({ type: 'DESTROY', model })
    }
  }, [ state ])

  if(!model || state != 'INITIALIZE') return null

  return <ModelContext.Provider value={model}>{children}</ModelContext.Provider>
}

const ModelRecoil = ({ name, schema, modelKey, initialValues, children, props: modelProps }) => {

  const model = React.useMemo(() => {
    return name ? getModel(name, modelKey, modelProps) : {
      ...schema,
      key: modelKey || schema.name,
      ...modelProps
    }
  }, [ name, schema, modelKey ])

  return (
    <RecoilRoot>
      <ModelContext.Provider value={model}>{children}</ModelContext.Provider>
    </RecoilRoot>
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
    { model => (
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

const ModelRoutes = () => {
  const { model } = use('model')

  const ModelList = model.components && model.components['ListPage'] || C('Model.ListPage')
  const ModelDetail =  model.components && model.components['DetailPage'] || C('Model.DetailPage')
  const ModelForm = model.components && model.components['AddPage'] || C('Model.FormPage')

  return (
    <Routes>
      { (!model.permission || model.permission.view) && <Route
        path="/"
        element={<ModelList />}
      /> }
      { (!model.permission || model.permission.view) && <Route
        path="list"
        element={<ModelList />}
      /> }
      { (!model.permission || model.permission.view) && <Route
        path=":id/detail"
        element={<ModelDetail />}
      /> }
      { (!model.permission || model.permission.add) && <Route
        path="add"
        element={<ModelForm />}
      /> }
      { (!model.permission || model.permission.edit) && <Route
        path=":id/edit"
        element={<ModelForm />}
      /> }
    </Routes>
  )
}

export {
  ModelContext,
  ModelWrap,
  ModelBlock,
  ModelRoutes,
  ModelRecoil,
  Model
}
