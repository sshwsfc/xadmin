import React from 'react'
import PropTypes from 'prop-types'

import { StoreWrap } from 'xadmin-core'

export default StoreWrap({

  contextTypes: {
    dashboardPath: PropTypes.object
  },

  getState: (context) => {
    const { store, dashboardPath } = context
    const state = store.getState()

    return { dashboard: dashboardPath ? dashboardPath(state) : state.dashboard }
  }
})
