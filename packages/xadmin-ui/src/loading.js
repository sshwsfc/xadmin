import React from 'react'
import omit from 'lodash/omit'
import LoadingBar, { loadingBarReducer, showLoading, hideLoading } from 'react-redux-loading-bar'
import { takeEvery, put, all } from 'redux-saga/effects'

export default {
  name: 'xadmin.loading',
  blocks: {
    'body': () => <LoadingBar key="loading" style={{ zIndex: 9999, height: 3, position: 'absolute', backgroundColor: 'rgba(82, 196, 26, 0.45)' }} />
  },
  reducers: {
    loadingBar: (state=0, action) => {
      switch (action.type) {
        case 'persist/REHYDRATE':
          return 0
        default:
          return loadingBarReducer(state, action)
      }
    },
    loading: (state={}, { type, key }) => {
      if(!key) {
        return state
      }
      switch (type) {
        case 'START_LOADING':
          return { ...state, [key]: true }
        case 'END_LOADING':
          return { ...omit(state, key) }
        default:
          return state
      }
    }
  },
  effects: (app) => function *() {
    yield all([
      takeEvery('START_LOADING', function *() {
        yield put(showLoading())
      }),
      takeEvery('END_LOADING', function *() {
        yield put(hideLoading())
      })
    ])
  }
}
