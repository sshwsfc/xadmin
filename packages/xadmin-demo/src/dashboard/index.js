import React from 'react'
import app from 'xadmin-core'
import dashboard, { Dashboard } from 'xadmin-dashboard'
import project from './project'

const live = {
  config: {
    router: 'hash'
  },
  routers: {
    '@' : {
      path: '/',
      component: ({ children }) => children,
      indexRoute: {
        onEnter: (_, replace) => replace({ pathname: '/show' })
      }
    },
    '/' : {
      path: 'show',
      component: (props) => <Dashboard {...props} editMode={false} />
    }
  }
}

app
.use(dashboard)
.use(live)

if (process.env.NODE_ENV !== 'production') {
  const editor = require('./editor').default
  app.use(editor)
}

app.use(project)

export default app
