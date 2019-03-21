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
    const is = props
    return props => C({ is, ...props })
  } else {
    const Component = app.get('components')[props.is]
    return <Component {...props} />
  }
}

C.get = is => app.get('components')[is]

const Main = C('Main')
const App = C('App')
const Dashboard = C('Dashboard')
const Page = C('Page')
const Icon = C('Icon')
const Loading = C('Loading')

const Dropdown = C('Dropdown')
const Menu = C('Menu')
Menu.SubMenu = C('Menu.SubMenu')
Menu.Item = C('Menu.Item')
/** UI Components */
const Badge = C('Badge')
const Card = C('Card')
const Modal = C('Modal')
const Button = C('Button')
const Popover = C('Popover')
const Tooltip = C('Tooltip')
const Table = C('Table')
const Tabs = C('Tabs')
Tabs.Item = C('Tabs.Item')
const Empty = C('Empty')
const List = C('List')
List.Item = C('List.Item')
const Alert = C('Alert')

export default {
  name: 'xadmin.ui',
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
  Main, Dashboard, App,
  Dropdown, Menu, Badge, Card,
  Modal, Button, Popover, Tooltip, 
  Table, Tabs, Empty, List, Alert
}
