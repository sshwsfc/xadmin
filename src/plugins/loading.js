import React from 'react'
import _ from 'lodash'
import LoadingBar, { loadingBarReducer, showLoading, hideLoading } from 'react-redux-loading-bar'
import { REHYDRATE } from 'redux-persist/constants'
import { fork, put, call, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga'

export default {
  name: 'xadmin.loading',
  blocks: {
    'top.left': () => <LoadingBar style={{ margin: '0 -15px' }} />
  },
  reducers: {
    loadingBar: (state=0, action) => {
      switch (action.type) {
        case REHYDRATE:
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
          return _.omit(state, key)
        default:
          return state
      }
    }
  },
  effects: (app) => function *() {
    yield [
      takeEvery('START_LOADING', function *() {
        yield put(showLoading())
      }),
      takeEvery('END_LOADING', function *() {
        yield put(hideLoading())
      })
    ]
  }
}
