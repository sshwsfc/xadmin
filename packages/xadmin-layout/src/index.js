import React from 'react'
import { Main, App, Page, Loading } from './bootstrap'
import Icon from 'react-fontawesome'
import app from 'xadmin'

class Dashboard extends React.Component {
  render() {
    const { _t } = app.context
    return <Page title={_t('Dashboard')}>{_t('Welcome, Have a nice day!')}</Page>
  }
}

export default {
  name: 'xadmin.layout',
  components: {
    Main, App, Dashboard
  },
  routers: app => {
    const { Main, App, Dashboard } = app.load_dict('components')
    return {
      '@' : {
        path: '/',
        component: Main,
        indexRoute: {
          onEnter: (_, replace) => replace({ pathname: '/app/' })
        }
      },
      '/' : {
        path: 'app/',
        component: App,
        indexRoute: {
          onEnter: (_, replace) => replace({ pathname: '/app/dashboard' })
        }
      },
      '/app/': {
        path: 'dashboard',
        component: Dashboard
      }
    }
  }
}

export {
  Page, Icon, Loading,
  Main,
  App
}
