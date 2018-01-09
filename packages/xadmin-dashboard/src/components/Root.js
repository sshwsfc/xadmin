import React from 'react'
import { app } from 'xadmin-core'
import Box from '../containers/Box'

export default {
  key: 'root',
  getWidget: () => app.load_dict('dashboard_widgets')['xadmin-dashboard/main'] || Box
}
