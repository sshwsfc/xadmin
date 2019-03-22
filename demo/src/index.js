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

import loading from 'xadmin-plugins/lib/loading'
import notice from 'xadmin-plugins/lib/notice'
import modalform from 'xadmin-plugins/lib/modalform'
import search from 'xadmin-plugins/lib/search'
import reldetail from 'xadmin-plugins/lib/reldetail'
import antdUI from 'xadmin-antd'

import models from './models'
import themes from './themes'
import API from './api'

import 'moment/locale/zh-cn' 

const App = React.lazy(() => import('./App'))

app
.use(i18n)
.use(ui)
.use(loading)
.use(notice)
.use(form)
.use(themes)
.use(model)
.use(filter)
.use(actions)
.use(relate)
.use(auth)
.use(modalform)
//.use(search)
.use(reldetail)
.use(antdUI)
.use({
  config: {
    api: API,
    locale: {
      lng: 'zh_Hans', moment: 'zh-cn'
    },
    auth: { can_signin: true, can_signup: true, can_reset_password: true, persist_type: 'session-storage' },
    date_format: {
      time: 'HH:mm:ss', date: 'YYYY-MM-DD', datetime: 'YYYY-MM-DD HH:mm:ss'
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
