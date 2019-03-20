import React from 'react'
import app from 'xadmin'
import 'antd/dist/antd.min.css'
import 'ant-design-pro/dist/ant-design-pro.min.css'
import routers, { Main, App, Page, Loading } from './layout'

import { NavItem } from './components/Nav'

export default {
  name: 'xadmin.ui.antd',
  components: {
    Main, App, Page, Loading,
    NavItem
  },
  routers
}
