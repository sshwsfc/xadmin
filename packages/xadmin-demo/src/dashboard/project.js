import React from 'react'
import dashboardData from './dashboard.json'

export default {
  on_create_store: (app) => (store) => {
    store.dispatch({ type:'@@x-dashboard/LOAD_DASHBOARD', payload: { data: {}, ...dashboardData } })
  }
}
