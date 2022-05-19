import React from 'react'
import app from 'xadmin'
//import 'antd/dist/antd.min.css'
import { message } from 'antd'
import { Main, App, Page, Loading, Icon, Dashboard } from './layout'

import { Menu, MenuItem } from './components/Menu'

import form from './form'
import model from './model'
import relate from './model/relate'
import filter from './filter'
import auth from './auth'
import effects from './effects'
import locales from './locales'

export default {
  name: 'xadmin.ui.antd',
  locales,
  components: {
    Main, App, Page, Loading, Icon, Dashboard,
    Menu, 'Menu.Item': MenuItem,
    ...form.components,
    ...model.components,
    ...filter.components,
    ...relate.components,
    ...auth.components
  },
  form_fields: {
    ...form.form_fields,
    ...filter.form_fields,
    ...relate.form_fields,
    ...auth.form_fields
  },
  hooks: {
    'message': () => message
  },
  effects
}
