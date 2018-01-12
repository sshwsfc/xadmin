import React from 'react'
import { persistStore, autoRehydrate } from 'redux-persist'
//import localforage from 'localforage'
import Main from './layouts/Main'
import App from './layouts/App'
import './main.css'

export default {
  name: 'xadmin.core',
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
    }
  },
  reducers: {
    root: (state=[], action) => {
      return state
    }
  // },
  // store_enhancers: (app) => autoRehydrate(),
  // on_create_store: (app) => (store) => {
  //   persistStore(store, { storage: localforage })
  }
}
