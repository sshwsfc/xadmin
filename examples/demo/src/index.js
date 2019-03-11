import './index.css';
import App from './App';
import app from 'xadmin';

import i18n from 'xadmin-i18n'
import form from 'xadmin-form'
import layout from 'xadmin-layout'

app
.use(i18n)
.use(layout)
.use(form)
.use({
  config: {
    locale: {
      lng: 'zh_Hans', moment: 'zh-cn'
    },
    auth: { can_signin: true, can_signup: false, can_reset_password: false, persist_type: 'session-storage' },
    date_format: {
      time: 'HH:mm:ss', date: 'YYYY-MM-DD', datetime: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  components: {
    App
  },
  reducers: {
    test: (state=0, action) => {
      if(action.type === 'TEST_ADD') return ++state
      return state
    }
  }
}).start({ container: '#root' })
