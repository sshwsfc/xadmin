import React from 'react'
import Editor from './components/Editor'
import form_fields from './fields'

import 'antd/dist/antd.css'
import './editor.css'

const routers = (app) => {
  return {
    '/app/dashboard/': [ {
      path: 'design',
      component: Editor
    } ]
  }
}

export {
  Editor
}

export default {
  routers,
  form_fields
}
