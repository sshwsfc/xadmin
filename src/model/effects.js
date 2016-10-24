import { fork, put, call, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga'
import { app } from '../index'
import adapter from './adapter/apicloud'

function *handle_get_list({ model, filter }) {
  const api = adapter(model.name)
  yield put({ type: 'START_LOADING', model })
  //yield delay(2000)
  const count = yield api.count(filter)
  const items = yield api.query(filter)
  yield put({ type: 'GET_ITEMS', model: model, items, filter, count })
  yield put({ type: 'END_LOADING', model })
}

function *handle_delete_item({ model, item }) {
  const api = adapter(model.name)
  yield put({ type: 'START_LOADING', model })
  yield api.delete(item.id)
  yield put({ type: 'SELECT_ITEMS', selected: false, item, model })
  yield put({ type: 'GET_ITEMS', model })
}

function *handle_get_item({ model, id }) {
  const api = adapter(model.name)
  yield put({ type: 'START_LOADING', model })
  const item = yield api.get(id)
  if(item) {
    yield put({ type: 'GET_ITEM', model, item, success: true })
  }
  yield put({ type: 'END_LOADING', model })
}

function *handle_save_item({ model, item }) {
  const api = adapter(model.name)
  yield put({ type: 'START_LOADING', model })
  const data = yield api.save(item)
  yield put({ type: 'SAVE_ITEM', model, item: data, success: true })
  yield put({ type: 'END_LOADING', model })
  const { router } = app.context
  router.push(`model/${model.name}/list`)
}

export default function *() {
  yield [
    takeEvery(action => action.model && action.type == 'GET_ITEMS' && action.items == undefined, handle_get_list),
    takeEvery(action => action.model && action.type == 'GET_ITEM' && action.success !== true, handle_get_item),
    takeEvery(action => action.model && action.type == 'SAVE_ITEM' && action.success !== true, handle_save_item),
    takeEvery(action => action.model && action.type == 'DELETE_ITEM', handle_delete_item)
  ]
}
