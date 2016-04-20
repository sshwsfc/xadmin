import React from 'react'
import { ModelList, ModelForm } from '../components/model'
import { Nav, NavItem } from 'react-bootstrap'
import modelReducer from './reducers'

module.exports = {
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

    pm.ctx['reducers'].push(modelReducer)
  }
}
