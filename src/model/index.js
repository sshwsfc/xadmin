import React from 'react'
import { combineReducers } from 'redux'
import Icon from '../components/Icon'
import List from './components/List'
import Form from './components/Form'
import { Nav, NavItem } from 'react-bootstrap'

import { model, ModelMixin } from './base'
import models from './models'
import get_reducers from './reducers'
import effects from './effects'
import mappers from './mappers'

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

const MainMenuItem = (name, model) => React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  render() {
    const router = this.context.router
    const go = (uri) => {
      return (e) => {
        router.push(uri)
      }
    }
    return (<NavItem key={`main-menu-item-model-${name}`} onSelect={go(`/model/${name}/list`)}>
      <Icon name={model.icon || name}/> {model.title}</NavItem>)
  }
})

export default {
  blocks: {
    main_menu: Object.keys(models).map((name) => MainMenuItem(name, models[name]))
  },
  routers: (app) => {
    let routes = []
    for (name in models) {
      routes = routes.concat([ {
        path: `model/${name}/list`,
        component: model(name, List)
      }, {
        path: `model/${name}/add`,
        component: model(name, Form)
      }, {
        path: `model/${name}/:id/edit`,
        component: model(name, Form)
      } ])
    }
    return {
      '/': routes
    }
  },
  reducers: (app) => {
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
  mappers
}
