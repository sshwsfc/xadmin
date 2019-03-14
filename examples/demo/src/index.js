import React from 'react'
import './index.css';
import App from './App';
import app from 'xadmin';
import { Nav } from 'react-bootstrap'

import i18n from 'xadmin-i18n'
import form from 'xadmin-form'
import layout, { Icon } from 'xadmin-layout'
import model from 'xadmin-model'
import relate from 'xadmin-model/lib/relate'
// import filter from 'xadmin-model/lib/filter'
import actions from 'xadmin-model/lib/actions'
import models from './models'
import themes from './themes'
import API from './api'

import 'moment/locale/zh-cn' 

app
.use(i18n)
.use(layout)
.use(form)
.use(themes)
.use({
  blocks: {
    'main.menu': () => (
      <Nav.Item key={`main-menu-dashboard`} >
        <Nav.Link eventKey="dashboard" onSelect={()=>app.go('/app/dashboard')}><Icon name="home"/> Home</Nav.Link>
      </Nav.Item>
    ),
    'top.right': () => <Nav.Link key="block">Admin</Nav.Link>
  },
})
.use(model)
.use(actions)
.use(relate)
.use({
  config: {
    api: API,
    locale: {
      lng: 'zh_Hans', moment: 'zh-cn'
    },
    auth: { can_signin: true, can_signup: false, can_reset_password: false, persist_type: 'session-storage' },
    date_format: {
      time: 'HH:mm:ss', date: 'YYYY-MM-DD', datetime: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  components: {
    Dashboard: App
  },
  reducers: {
    test: (state=0, action) => {
      if(action.type === 'TEST_ADD') return ++state
      return state
    }
  },
  mappers: {
    test: {
      method: {
        add: ({ dispatch }) => () => dispatch({ type: 'TEST_ADD' })
      }
    }
  },
  models
}).start({ container: '#root' })
