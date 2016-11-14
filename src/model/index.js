import React from 'react'
import { combineReducers } from 'redux'
import Icon from '../components/Icon'
import List from './components/List'
import Form from './components/Form'
import { Nav, NavItem } from 'react-bootstrap'

import { model as modelWrap, ModelMixin } from './base'
import get_reducers from './reducers'
import effects from './effects'
import mappers from './mappers'
import field_render from './fields'

import adapter from './adapter/apicloud'

const createModelReducers = (model, app) => {
  const model_reducers = {
    ...get_reducers(model),
    ...app.load_dict('model_reducer')
  }
  return combineReducers(Object.keys(model_reducers).reduce((prev, key) => {
    prev[key] = model_reducers[key](model)
    return prev
  }, {}))
}

const app = {
  blocks: (app) => {
    const models = app.load_dict('models')
    return {
      'main.menu': () => {
        return Object.keys(models).map((name) => {
          const model = models[name]
          if((!model.permission || model.permission.view) && 
            (!model.ui || model.ui.show_menu)) {
            return (
              <NavItem key={`main-menu-item-model-${name}`} onSelect={()=>app.go(`/model/${name}/list`)}>
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
      let model_routes = []

      if(!model.permission || model.permission.view) {
        model_routes.push({
          path: `model/${name}/list`,
          component: modelWrap(name, List),
          onEnter: (props) => { }
        })
      }
      if(model.permission && model.permission.add) {
        model_routes.push({
          path: `model/${name}/add`,
          component: modelWrap(name, Form)
        })
      }
      if(model.permission && model.permission.edit) {
        model_routes.push({
          path: `model/${name}/:id/edit`,
          component: modelWrap(name, Form)
        })
      }
      routes = routes.concat(model_routes)
    }
    return {
      '/': routes
    }
  },
  reducers: (app) => {
    const models = app.load_dict('models')
    return {
      model: combineReducers(Object.keys(models).reduce((prev, name) => {
        return {
          ...prev,
          [name]: createModelReducers(models[name], app)
        }
      }, {}))
    }
  },
  effects: (app) => effects,
  mappers,
  field_render
}

export default {
  app
}
