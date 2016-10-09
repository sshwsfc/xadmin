import { fork, put, call, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga'

import adapter from './adapter/apicloud'

function *handle_get_list({ model, filter }) {
  const api = adapter(model.name)
  yield put({ type: 'START_LOADING', model })
  //yield delay(2000)
  const total_count = yield api.count(filter)
  const items = yield api.query(filter)
  yield put({ type: 'GET_ITEMS', model: model, items: items, filter, count: total_count })
  yield put({ type: 'END_LOADING', model })
}

function *handle_delete_item({ model, item }) {
  const api = adapter(model.name)
  yield put({ type: 'START_LOADING', model })
  yield api.delete(item.id)
  yield put({ type: 'SELECT_ITEMS', selected: false, item, model })
  yield put({ type: 'GET_ITEMS', model })
}

export default function *() {
  yield [
    takeEvery(action => action.model && action.type == 'GET_ITEMS' && action.items == undefined, handle_get_list),
    takeEvery(action => action.model && action.type == 'DELETE_ITEM', handle_delete_item)
  ]
}
