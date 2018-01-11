import React from 'react'
import { app, StoreWrap } from 'xadmin-core'

import i18n from 'xadmin-i18n'
import form from 'xadmin-form'
import layout from 'xadmin-layout'
import model from 'xadmin-model'

import filter from 'xadmin-model/lib/filter'
import actions from 'xadmin-model/lib/actions'

import api from './mock'

export default app
.use(i18n)
.use(layout)
.use(form)
.use(model)
.use(filter)
.use(actions)
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
        regDate: {
          title: 'Reg Date',
          type: 'string',
          format: 'date'
        },
        level: {
          type: 'number',
          enum: [ 1, 2 ],
          enum_title: [ 'User', 'Adminstrator' ]
        },
        departments: {
          type: 'array',
          title: '用户所属部门',
          items: {
            type: 'object',
            name: 'Department',
            properties: {
              Id: { type: 'string' },
              name: { type: 'string' }
            }
          }
        }
      },
      permission: { view: true, add: true, edit: true, delete: true },
      form: [ 'id', 'name', 'email', 'regDate', 'level', 'departments' ],
      filters: {
        nav: [ 'name', 'id', 'email', 'regDate' ],
        sidemenu: [ 'id' ]
      },
      search_fields: [ 'name', 'email' ],
      required: [ 'name', 'id', 'email', 'level' ],
      readonly: [ 'id', 'eid' ],
      list_display: [ 'name', 'id', 'email', 'regDate', 'level' ]
    }
  }
})
