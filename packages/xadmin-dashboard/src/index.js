import React from 'react'
import Editor from './components/Editor'
import Dashboard from './components/Dashboard'
import _ from 'lodash'
import models from './models'
import mappers from './mappers'
import reducers from './reducers'
import form_fields from './fields'
import dashboard_widgets from './widgets'
import DashboardWrap from './wrap'
import TextModal from './fields/DataPathText'

import 'animate.css'
import 'antd/dist/antd.css'
import './main.css'
import './editor.css'

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g

export default {
  routers: (app) => {
    return {
      '/app/model/dashboard/': [ {
        path: ':id/show',
        component: (props) => <Dashboard {...props} editMode={false} />
      }, {
        path: ':id/design',
        component: Editor
      } ]
    }
  },
  form_fields:{
    ...form_fields,
    text: {
      component: TextModal
    }
  },
  models,
  mappers,
  reducers,
  dashboard_widgets,
  DashboardWrap,
  Dashboard,
  Editor
}
