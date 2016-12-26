import React from 'react'
import { combineReducers } from 'redux'
import Icon from '../components/Icon'
import ModelPages from './components/Pages'
import { Nav, NavItem } from 'react-bootstrap'

import { Model } from './base'
import modelReducer from './reducer'
import effects from './effects'
import mappers from './mappers'
import field_render from './fields'

const app = {
  name: 'xadmin.model',
  blocks: (app) => {
    const models = app.load_dict('models')
    return {
      'main.menu': () => {
        return Object.keys(models).map((name) => {
          const model = models[name]
          if((!model.permission || model.permission.view) && 
            (!model.ui || model.ui.show_menu)) {
            return (
              <NavItem key={`main-menu-item-model-${name}`} onSelect={()=>app.go(`/app/model/${name}/list`)}>
                <Icon name={model.icon || name}/> {model.title}
              </NavItem>
              )
          }
        }).filter(item => item !== undefined)
      }
    }
  },
  routers: (app) => {
    const models = app.load_dict('models')
    let routes = []
    for (name in models) {
      const model = models[name]
      const model_routes = []

      if(!model.permission || model.permission.view) {
        model_routes.push({
          path: 'list',
          component: ModelPages.ModelListPage
        })
      }
      if(model.permission && model.permission.add) {
        model_routes.push({
          path: ':id/detail',
          component: ModelPages.ModelDetailPage
        })
      }
      if(model.permission && model.permission.add) {
        model_routes.push({
          path: 'add',
          component: ModelPages.ModelFormPage
        })
      }
      if(model.permission && model.permission.edit) {
        model_routes.push({
          path: ':id/edit',
          component: ModelPages.ModelFormPage
        })
      }
      routes = routes.concat({
        path: `model/${name}/`,
        component: Model(name, name, true),
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

export default {
  app
}
