import React from 'react'
import Icon from 'react-fontawesome'
import { C } from 'xadmin-layout'

import ModelPages from './components/Pages'
import ChildrenModelBtn from './components/ChildrenModel'
import { Model, ModelWrap, ModelContext } from './base'
import modelReducer from './reducer'
import effects from './effects'
import mappers from './mappers'
import field_render from './fields'

const app = {
  name: 'xadmin.model',
  items: {
    models: { type: 'map' }
  },
  blocks: (app) => {
    const models = app.get('models')
    return {
      'main.menu': () => {
        const NavItem = C('NavItem')
        return Object.keys(models).map((name) => {
          const model = models[name]
          if((!model.permission || model.permission.view) && 
            (!model.ui || model.ui.show_menu)) {
            return <NavItem itemKey={`main-menu-item-model-${name}`} onSelect={()=>app.go(`/app/model/${name}/list`)} icon={<Icon name={model.icon || name}/>}>{model.title}</NavItem>
          }
        }).filter(item => item !== undefined)
      }
    }
  },
  routers: (app) => {
    const models = app.get('models')
    const { _t } = app.context
    let routes = []
    for (let name in models) {
      const model = models[name]
      const model_routes = []
      const modelName = model.title || model.name

      if(!model.permission || model.permission.view) {
        model_routes.push({
          path: 'list',
          breadcrumbName: _t('{{name}} List', { name: modelName }),
          component: model.components && model.components['page_list'] || ModelPages.ModelListPage
        })
      }
      if(model.permission && model.permission.view) {
        model_routes.push({
          path: ':id/detail',
          breadcrumbName: _t('{{name}} Detail', { name: modelName }),
          component: model.components && model.components['page_detail'] || ModelPages.ModelDetailPage
        })
      }
      if(model.permission && model.permission.add) {
        model_routes.push({
          path: 'add',
          breadcrumbName: _t('Create {{name}}', { name: modelName }),
          component: model.components && model.components['page_add'] || ModelPages.ModelFormPage
        })
      }
      if(model.permission && model.permission.edit) {
        model_routes.push({
          path: ':id/edit',
          breadcrumbName: _t('Edit {{name}}', { name: modelName }),
          component: model.components && model.components['page_edit'] || ModelPages.ModelFormPage
        })
      }
      routes = routes.concat({
        path: `model/${name}/`,
        breadcrumbName: _t('{{name}} List', { name: modelName }),
        component: ({ children }) => <Model name={name}>{children}</Model>,
        indexRoute: {
          onEnter: ({ location }, replace) => replace({ pathname: location.pathname + 'list' })
        },
        childRoutes: model_routes
      })
    }
    return {
      '/app/': routes
    }
  },
  reducers: {
    model: modelReducer
  },
  effects: (app) => effects,
  mappers,
  field_render
}

export { Model, ModelWrap, ModelContext, ChildrenModelBtn }
export default app
