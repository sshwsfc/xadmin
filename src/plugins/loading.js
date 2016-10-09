import LoadingBar, { loadingBarReducer, showLoading, hideLoading } from 'react-redux-loading-bar'

import { fork, put, call, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga'

export default {
  blocks: {
    'main.top': LoadingBar
  },
  reducers: {
    loadingBar: loadingBarReducer
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
