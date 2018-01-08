import React from 'react'

import { StoreWrap } from 'xadmin'

export default StoreWrap({

  contextTypes: {
    dashboardPath: React.PropTypes.object
  },

  getState: (context) => {
    const { store, dashboardPath } = context
    const state = store.getState()

    return { dashboard: dashboardPath ? dashboardPath(state) : state.dashboard }
  }
})
