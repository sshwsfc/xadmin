import React from 'react'
import { persistStore, autoRehydrate } from 'redux-persist'
import localForage from 'localForage'
import MainApp from './layouts/Main'

export default {
  routers: {
    '@' : {
      path: '/',
      component: MainApp
    }
  },
  reducers: {
    root: (state=[], action) => {
      return state
    }
  // },
  // store_enhancers: (app) => autoRehydrate(),
  // on_create_store: (app) => (store) => {
  //   persistStore(store, { storage: localForage })
  }
}
