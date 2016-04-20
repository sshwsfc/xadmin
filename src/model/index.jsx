import React from 'react'
import List from './components/List'
import Form from './components/Form'
import { Nav, NavItem } from 'react-bootstrap'

import { model, ModelMixin } from './base'

const ModelList = model(List)
const ModelForm = model(Form)

module.exports = {
  model,
  ModelMixin,
  use (pm) {
    // route
    pm.ctx['routes'] = pm.ctx['routes'].concat([{
      path: 'model/:model/list',
      component: ModelList
    }, {
      path: 'model/:model/add',
      component: ModelForm
    }, {
      path: 'model/:model/:id/edit',
      component: ModelForm
    }])

  }
}
