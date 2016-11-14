import { fork, put, call, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga'
import { app } from '../index'

function *handle_get_list({ model, filter, wheres }) {
  yield put({ type: 'START_LOADING', model })
  const { store } = app.context
  const modelState = store.getState().model[model.name]
  const { items, total } = yield model.$api.query(filter || modelState.filter, wheres || modelState.wheres)
  yield put({ type: 'GET_ITEMS', model: model, items, filter, wheres, count: total })
  yield put({ type: 'END_LOADING', model })
}

function *handle_delete_item({ model, item }) {
  yield put({ type: 'START_LOADING', model })
  yield model.$api.delete(item.id)
  yield put({ type: 'SELECT_ITEMS', selected: false, item, model })
  yield put({ type: 'GET_ITEMS', model })
  yield put({ type: 'END_LOADING', model })
}

function *handle_get_item({ model, id }) {
  yield put({ type: 'START_LOADING', model })
  const item = yield model.$api.get(id)
  if(item) {
    yield put({ type: 'GET_ITEM', model, item, success: true })
  }
  yield put({ type: 'END_LOADING', model })
}

function *handle_save_item({ model, item, promise }) {
  yield put({ type: 'START_LOADING', model })
  const data = yield model.$api.save(item)
  yield put({ type: 'SAVE_ITEM', model, item: data || item, success: true })
  if(promise) {
    promise.resolve(data)
  }
  yield put({ type: 'END_LOADING', model })
  const { router } = app.context
  router.push(`/model/${model.name}/list`)
}

export default function *() {
  yield [
    takeEvery(action => action.model && action.type == 'GET_ITEMS' && action.items == undefined, handle_get_list),
    takeEvery(action => action.model && action.type == 'GET_ITEM' && action.success !== true, handle_get_item),
    takeEvery(action => action.model && action.type == 'SAVE_ITEM' && action.success !== true, handle_save_item),
    takeEvery(action => action.model && action.type == 'DELETE_ITEM', handle_delete_item)
  ]
}
