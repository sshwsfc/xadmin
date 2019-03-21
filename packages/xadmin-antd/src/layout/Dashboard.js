import React from 'react'
import { app, Block } from 'xadmin'
import { Page } from 'xadmin-ui'

class Dashboard extends React.Component {
  render() {
    const { _t } = app.context
    return <Page title={_t('Dashboard')}><div>{_t('Welcome, Have a nice day!')}</div>{Block('dashboard.main', this)}</Page>
  }
}

export default Dashboard
