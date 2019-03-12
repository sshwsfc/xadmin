import React from 'react'
import './index.css';
import App from './App';
import app from 'xadmin';
import { Nav } from 'react-bootstrap'

import i18n from 'xadmin-i18n'
import form from 'xadmin-form'
import layout from 'xadmin-layout'
//import model from 'xadmin-model'
import models from './models'
import API from './api'

import 'moment/locale/zh-cn' 

app
.use(i18n)
.use(layout)
.use(form)
//.use(model)
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
  blocks: {
    'top.right': () => <Nav.Link key="block">Block</Nav.Link>
  },
  components: {
    App
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
