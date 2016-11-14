import React from 'react'
import { persistStore, autoRehydrate } from 'redux-persist'
//import localforage from 'localforage'
import MainApp from './layouts/Main'
import './main.css'

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
  //   persistStore(store, { storage: localforage })
  }
}
