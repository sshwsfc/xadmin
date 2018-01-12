import React from 'react'
import _ from 'lodash'
import { Button, ButtonGroup, Panel, Media, Badge, Tabs, Tab, Grid, Row, Col } from 'react-bootstrap'
import { app } from 'xadmin'

const dashboard = ({ context: { _t } }) => ({
  name: 'dashboard',
  type: 'object',
  icon: 'dashboard',
  title: _t('Dashboard'),
  properties: {
    id: { type: 'string' },
    name: {
      type: 'string',
      title: _t('Dashboard Name')
    }
  },
  permission: { view: true, add: true, edit: true, delete: true },
  list_display: [ 'name' ],
  form: [ 'name' ],
  required: [ 'name' ],
  components: {}
})

export default (app) => ({
  dashboard: dashboard(app)
})
