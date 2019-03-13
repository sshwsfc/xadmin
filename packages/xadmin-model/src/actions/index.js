import React from 'react'
import { SubmissionError } from 'xadmin-form'
import { all, fork, put, call, cancelled, takeEvery } from 'redux-saga/effects'
import app, { api } from 'xadmin'

import BatchDelete from './BatchDelete'
import BatchChange from './BatchChange'

function *handle_delete_items({ model, items, message }) {
  yield put({ type: 'START_LOADING', model, key: `${model.key}.delete_items` })
  const { _t } = app.context
  const API = api(model)

  try {
    if(API.batchDelte) {
      yield API.batchDelte(items.map(item=>item.id))
    } else {
      yield all(items.map(item => call([ API, API.delete ], item.id)))
    }
    for(let item of items) {
      yield put({ type: 'SELECT_ITEMS', selected: false, item, model })
    }
    yield put({ type: 'GET_ITEMS', model })
  } catch(err) {
    app.error(err)
  }

  yield put({ type: 'END_LOADING', model, key: `${model.key}.delete_items` })
}

function *handle_change_items({ model, items, value, promise, message }) {
  yield put({ type: 'START_LOADING', model, key: `${model.key}.save_items` })
  const { _t } = app.context
  const API = api(model)
  let ret

  try {
    if(API.batchSave) {
      ret = yield API.batchSave(items, value)
    } else {
      ret = yield all(items.map(item => call([ API, API.save ], { id: item.id, ...value }, true)))
    }
    yield put({ type: 'GET_ITEMS', model })

    if(promise) {
      promise.resolve(ret)
    }

    if( message !== false) {
      const object = model.title || model.name
      const noticeMessage = message || _t('Batch Save {{object}} success', { object })
      yield put({ type: '@@xadmin/ADD_NOTICE', payload: {
        type: 'success', headline: 'Success', message: noticeMessage
      } }) 
    }
  } catch(err) {
    app.error(err)
    if(promise) {
      promise.reject(err)
    }
  }
  yield put({ type: 'END_LOADING', model , key: `${model.key}.save_items` })
}

export default {
  blocks: {
    'model.list.actions': [ 
      (props) => {
        const model = props.model
        if(!!model.permission && !!model.permission.delete) {
          return <BatchDelete {...props} />
        } else {
          return null
        }
      }, 
      (props) => {
        const model = props.model
        if(model.batch_change_fields && !!model.permission && !!model.permission.edit) {
          return <BatchChange {...props} />
        } else {
          return null
        }
      }
    ]
  },
  mappers: {
    'actons.batch_delete': {
      data: ({ model }) => {
        return {
          canDelete: !!model.permission && !!model.permission.delete
        }
      },
      method: {
        onBatchDelete: ({ model, modelState, dispatch }) => () => {
          const items = modelState.selected
          dispatch({ model, type: 'DELETE_ITEMS', items })
        }
      }
    },
    'actons.batch_change': {
      data: ({ model }) => {
        return {
          fields: model.batch_change_fields || [],
          canEdit: !!model.permission && !!model.permission.edit
        }
      },
      method: {
        onBatchChange: ({ model, modelState, dispatch }, { successMessage }) => (value) => {
          const items = modelState.selected

          return new Promise((resolve, reject) => {
            dispatch({ model, type: 'SAVE_ITEMS', items, value, promise: { resolve, reject }, message: successMessage })
          }).catch(err => {
            throw new SubmissionError(err.json)
          })
        }
      }
    }
  },
  effects: function *() {
    yield all([
      takeEvery(action => action.model && action.type == 'DELETE_ITEMS' && action.success !== true, handle_delete_items),
      takeEvery(action => action.model && action.type == 'SAVE_ITEMS' && action.success !== true, handle_change_items)
    ])
  }
}
