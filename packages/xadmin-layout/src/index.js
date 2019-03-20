import React from 'react'
import { Main as BsMain, App as BsApp, Page as BsPage, Loading as BsLoading, NavItem } from './bootstrap'
import BsIcon from 'react-fontawesome'
import app from 'xadmin'

class BsDashboard extends React.Component {
  render() {
    const { _t } = app.context
    return <Page title={_t('Dashboard')}>{_t('Welcome, Have a nice day!')}</Page>
  }
}

const C = props => {
  if(typeof props == 'string') {
    return app.get('components')[props]
  } else {
    const Component = app.get('components')[props.t]
    return <Component {...props} />
  }
}

const Main = props => C({ t: 'Main', ...props })
const App = props => C({ t: 'App', ...props })
const Dashboard = props => C({ t: 'Dashboard', ...props })
const Page = props => C({ t: 'Page', ...props })
const Icon = props => C({ t: 'Icon', ...props })
const Loading = props => C({ t: 'Loading', ...props })

export default {
  name: 'xadmin.layout',
  items: {
    components: { type: 'map' }
  },
  components: {
    Main: BsMain, 
    App: BsApp, 
    Dashboard: BsDashboard,
    Page: BsPage,
    Icon: BsIcon,
    Loading: BsLoading,
    NavItem
  },
  routers: app => {
    const { Main, App, Dashboard } = app.get('components')
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
  C,
  Page, Icon, Loading,
  Main, Dashboard, App
}
