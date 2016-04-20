import React from 'react'
import List from './components/List'
import Form from './components/Form'
import { Nav, NavItem } from 'react-bootstrap'

import { model, ModelMixin } from './base'
import models from './models'

module.exports = {
  model,
  ModelMixin,
  use (pm) {
    // route
    let routes = []
    for (name in models){
      routes = routes.concat([{
        path: `model/${name}/list`,
        component: model(name, List)
      }, {
        path: `model/${name}/add`,
        component: model(name, Form)
      }, {
        path: `model/${name}/:id/edit`,
        component: model(name, Form)
      }])
    }
    pm.ctx['routes'] = pm.ctx['routes'].concat(routes)
  }
}
