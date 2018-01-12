import { all, fork, put, call, cancelled, takeEvery } from 'redux-saga/effects'
import app, { api } from 'xadmin'

function *handle_get_list({ model, filter, wheres }) {
  yield put({ type: 'START_LOADING', model, key: `${model.key}.items` })
  const { store } = app.context
  const modelState = store.getState().model[model.key]

  try {
    const { items, total } = yield api(model).query(filter || modelState.filter, wheres || modelState.wheres)
    yield put({ type: 'GET_ITEMS', model: model, items: items || [], filter, wheres, count: total })
  } catch(err) {
    app.error(err)
    yield put({ type: 'GET_ITEMS', model: model, items: [], filter, wheres, count: 0 })
  }

  yield put({ type: 'END_LOADING', model, key: `${model.key}.items` })
}

function *handle_delete_item({ model, item, message }) {
  yield put({ type: 'START_LOADING', model, key: `${model.key}.delete` })
  const { _t } = app.context

  try {
    yield api(model).delete(item.id)
    yield put({ type: 'SELECT_ITEMS', selected: false, item, model })
    yield put({ type: '@@xadmin/ADD_NOTICE', payload: {
      type: 'success', headline: _t('Success'), message: message || _t('Delete {{object}} success', { object: model.title || model.name })
    } })
    yield put({ type: 'GET_ITEMS', model })
  } catch(err) {
    app.error(err)
  }

  yield put({ type: 'END_LOADING', model, key: `${model.key}.delete` })
}

function *handle_get_item({ model, id }) {
  yield put({ type: 'START_LOADING', model, key: `${model.key}.get` })
  const { _t } = app.context

  try {
    const item = yield api(model).get(id)
    if(item) {
      yield put({ type: 'GET_ITEM', model, item, success: true })
    }
  } catch(err) {
    app.error(err)
  }

  yield put({ type: 'END_LOADING', model, key: `${model.key}.get` })
}

function *handle_save_item({ model, item, promise, message }) {
  yield put({ type: 'START_LOADING', model, key: `${model.key}.save` })
  const { _t } = app.context

  try {
    const data = yield api(model).save(item)
    yield put({ type: 'SAVE_ITEM', model, item: data || item, success: true })
    if(promise) {
      promise.resolve(data)
    }
    if( message !== false) {
      const object = model.title || model.name
      const noticeMessage = message || (item.id == undefined ? 
        _t('Create {{object}} success', { object }) : 
        _t('Save {{object}} success', { object }))
      yield put({ type: '@@xadmin/ADD_NOTICE', payload: {
        type: 'success', headline: _t('Success'), message: noticeMessage
      } }) 
    }
  } catch(err) {
    app.error(err)
    if(promise) {
      promise.reject(err)
    }
  }
  yield put({ type: 'END_LOADING', model , key: `${model.key}.save` })
}

export default function *() {
  yield all([
    takeEvery(action => action.model && action.type == 'GET_ITEMS' && action.items == undefined, handle_get_list),
    takeEvery(action => action.model && action.type == 'GET_ITEM' && action.success !== true, handle_get_item),
    takeEvery(action => action.model && action.type == 'SAVE_ITEM' && action.success !== true, handle_save_item),
    takeEvery(action => action.model && action.type == 'DELETE_ITEM', handle_delete_item)
  ])
}
