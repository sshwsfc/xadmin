import React from 'react'
import _ from 'lodash'
import { Block, StoreWrap, app, use } from 'xadmin'
import { C } from 'xadmin-ui'
import { Routes, Route } from "react-router-dom"
import { RecoilRoot, useRecoilSnapshot } from 'recoil'
import * as atoms from './atoms'

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

const DebugObserver = () => {
  const snapshot = useRecoilSnapshot();
  React.useEffect(() => {
    console.debug('[Recoil]数据状态变更:');
    for (const node of snapshot.getNodes_UNSTABLE({isModified: true})) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);
  return null;
}

const ModelStateEffect = () => { use('model.effect'); return null }

const Model = ({ name, schema, modelKey, initialValues, children, props: modelProps }) => {
  const query = use('query')
  const model = React.useMemo(() => {
    return name ? getModel(name, modelKey, modelProps) : {
      ...schema,
      key: modelKey || schema.name,
      ...modelProps
    }
  }, [ name, schema, modelKey ])

  const initializeState = React.useCallback(({ set }) => {
    let initial = initialValues || {}
    if(!initial && model.initialValues) {
      initial = _.isFunction(model.initialValues) ? model.initialValues() : model.initialValues
    }
    const { wheres={}, ...option } = initial

    const defaultOpt = {
      fields: [ ...(model.listFields || []) ],
      order: {},
      limit: model.defaultPageSize || 15,
      skip: 0
    }
    if(query && !_.isEmpty(query)) {
      wheres.param_filter = query
    }
    
    set(atoms.option, { ...defaultOpt, ...option })
    set(atoms.wheres, wheres)
  }, [ initialValues, model, query ])

  return model && (
    <RecoilRoot initializeState={initializeState}>
      <DebugObserver />
      <ModelContext.Provider value={model}>
        <ModelStateEffect />
        {children}
      </ModelContext.Provider>
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
  Model
}
