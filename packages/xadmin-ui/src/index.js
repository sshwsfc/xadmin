import React from 'react'
import app from 'xadmin'

const C = args => {
  if(typeof args == 'string') {
    return props => {
      const Component = app.get('components')[args]
      if(Component) 
        return <Component {...props} />
      else
        return <div>Component {args} not found.</div>
    }
  } else {
    const { is, props } = args
    const Component = app.get('components')[is]
    if(Component) 
      return <Component {...props} />
    else
      return <div>Component {is} not found.</div>
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
  routers: {
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

export {
  C,
  Page, Icon, Loading,
  Main, Dashboard, App,
  Dropdown, Menu, Badge, Card,
  Modal, Button, Popover, Tooltip, 
  Table, Tabs, Empty, List, Alert
}
