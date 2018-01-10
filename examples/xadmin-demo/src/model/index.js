import React from 'react'
import { app, StoreWrap } from 'xadmin-core'

import i18n from 'xadmin-i18n'
import form from 'xadmin-form'
import model from 'xadmin-model'

import api from './mock'

export default app
.use(i18n)
.use(form)
.use(model)
.use({
  config: {
    api
  },
  models:{
    user: {
      name: 'user',
      type: 'object',
      icon: 'user',
      title: 'User',
      properties: {
        id: {
          type: 'string',
          title: 'User ID'
        },
        name: {
          type: 'string'
        },
        email: {
          type: 'string',
          format: 'email'
        },
        level: {
          type: 'number',
          enum: [ 1, 2 ],
          enum_title: [ 'User', 'Adminstrator' ]
        }
      },
      permission: { view: true, add: true, edit: true, delete: true },
      form: [ 'id', 'name', 'email', 'level' ],
      filters: {
        nav: [ 'name', 'id', 'email' ],
        sidemenu: [ 'id' ]
      },
      required: [ 'name', 'id', 'email', 'level' ],
      readonly: [ 'id', 'eid' ],
      list_display: [ 'name', 'id', 'email', 'level' ]
    }
  }
})
