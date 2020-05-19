import React from 'react'
import './index.css';
import app from 'xadmin';

import i18n from 'xadmin-i18n'
import auth from 'xadmin-auth'
import form from 'xadmin-form'
import ui, { Loading } from 'xadmin-ui'
import model from 'xadmin-model'
import relate from 'xadmin-model/lib/relate'
import filter from 'xadmin-model/lib/filter'
import actions from 'xadmin-model/lib/actions'

import loading from 'xadmin-ui/lib/loading'
import splashscreen from 'xadmin-ui/lib/splashscreen'

import modalform from 'xadmin-model/lib/modalform'
import search from 'xadmin-model/lib/search'
import reldetail from 'xadmin-model/lib/reldetail'

import components from 'xadmin-antd'
//import components from 'xadmin-bootstrap'

import models from './models'
// import themes from './themes'
import API from './api'

import 'moment/locale/zh-cn' 
import 'antd/dist/antd.min.css'
const App = React.lazy(() => import('./App'))

app
.use(i18n)
.use(ui)
.use(loading)
.use(form)
//.use(themes)
.use(model)
.use(filter)
.use(actions)
.use(relate)
.use(auth)
.use(modalform)
.use(search)
.use(reldetail)
.use(components)
.use(splashscreen)
.use({
  config: {
    api: API,
    locale: {
      lng: 'zh_Hans', moment: 'zh-cn'
    },
    auth: { can_signin: true, can_signup: true, can_reset_password: true, persist_type: 'session-storage' },
    date_format: {
      time: 'HH:mm:ss', date: 'YYYY-MM-DD', datetime: 'YYYY-MM-DD HH:mm:ss'
    },
    filter: {
      textDefaultSearch: true
    }
  },
  components: {
    Dashboard: () => (
      <React.Suspense fallback={<Loading />}>
        <App />
      </React.Suspense>
    )
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
