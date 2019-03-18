import React from 'react'
import Dashboard from './components/Dashboard'
import _ from 'lodash'
import models from './models'
import mappers from './mappers'
import reducers from './reducers'
import dashboard_widgets from './widgets'
import DashboardWrap from './wrap'

import 'animate.css'
import './main.css'

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g

const routers = (app) => {
  return {
    '/app/dashboard/': [ {
      path: 'show',
      component: (props) => <Dashboard {...props} editMode={false} />
    } ]
  }
}

export {
  DashboardWrap,
  Dashboard
}

export default {
  routers,
  models,
  mappers,
  reducers,
  dashboard_widgets
}
