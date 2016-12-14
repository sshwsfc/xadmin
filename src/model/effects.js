import { fork, put, call, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga'
import { app } from '../index'
import api from '../api'

function *handle_get_list({ model, filter, wheres }) {
  yield put({ type: 'START_LOADING', model, key: `${model.name}.items` })
  const { store } = app.context
  const modelState = store.getState().model[model.name]
  try {
    const { items, total } = yield api(model).query(filter || modelState.filter, wheres || modelState.wheres)
    yield put({ type: 'GET_ITEMS', model: model, items, filter, wheres, count: total })
  } catch(err) {
    console.error(err)
    yield put({ type: 'GET_ITEMS', model: model, items: [], filter, wheres, count: 0 })
  }
  yield put({ type: 'END_LOADING', model, key: `${model.name}.items` })
}

function *handle_delete_item({ model, item }) {
  yield put({ type: 'START_LOADING', model, key: `${model.name}.delete` })
  yield api(model).delete(item.id)
  yield put({ type: 'SELECT_ITEMS', selected: false, item, model })
  yield put({ type: 'GET_ITEMS', model })
  yield put({ type: 'END_LOADING', model, key: `${model.name}.delete` })
}

function *handle_get_item({ model, id }) {
  yield put({ type: 'START_LOADING', model, key: `${model.name}.get` })
  const item = yield api(model).get(id)
  if(item) {
    yield put({ type: 'GET_ITEM', model, item, success: true })
  }
  yield put({ type: 'END_LOADING', model, key: `${model.name}.get` })
}

function *handle_save_item({ model, item, promise }) {
  yield put({ type: 'START_LOADING', model, key: `${model.name}.save` })
  const data = yield api(model).save(item)
  yield put({ type: 'SAVE_ITEM', model, item: data || item, success: true })
  if(promise) {
    promise.resolve(data)
  }
  yield put({ type: 'END_LOADING', model , key: `${model.name}.save` })
  const { router } = app.context
  router.goBack()
}

export default function *() {
  yield [
    takeEvery(action => action.model && action.type == 'GET_ITEMS' && action.items == undefined, handle_get_list),
    takeEvery(action => action.model && action.type == 'GET_ITEM' && action.success !== true, handle_get_item),
    takeEvery(action => action.model && action.type == 'SAVE_ITEM' && action.success !== true, handle_save_item),
    takeEvery(action => action.model && action.type == 'DELETE_ITEM', handle_delete_item)
  ]
}
