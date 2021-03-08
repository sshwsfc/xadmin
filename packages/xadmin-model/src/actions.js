import React from 'react'
import _ from 'lodash'
import { effects } from 'redux-saga'
import app, { api, use } from 'xadmin'
import { C } from 'xadmin-ui'
const { all, fork, put, call, cancelled, takeEvery } = effects

function *handle_delete_items({ model, items, promise, message }) {
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

    if(promise) {
      promise.resolve(null)
    }
    if( message !== false) {
      const object = model.title || model.name
      const noticeMessage = message || _t('Delete {{object}} success', { object })
      yield put({ type: '@@xadmin/ADD_NOTICE', payload: {
        type: 'success', headline: 'Success', message: noticeMessage
      } }) 
    }
    yield put({ type: 'GET_ITEMS', model })
  } catch(err) {
    app.error(err)
    if(promise) {
      promise.reject(err)
    }
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
  items: {
    modelBatchActions: { type: 'map' }
  },
  modelBatchActions: {
    edit: {
      default: true, 
      component: (props) => {
        const model = props.model
        if(model.batchChangeFields && !!model.permission && !!model.permission.edit) {
          return <C is="Model.BatchChange" {...props} />
        } else {
          return null
        }
      }
    },
    delete: {
      default: true, 
      component: (props) => {
        const model = props.model
        if(!!model.permission && !!model.permission.delete) {
          return <C is="Model.BatchDelete" {...props} />
        } else {
          return null
        }
      }
    }
  },
  hooks: {
    'model.batchActions': props => {
      const { model } = use('model', props)
      const modelActions = app.get('modelBatchActions')
      const actions = model.batchActions === undefined ? 
        Object.keys(modelActions).filter(k => modelActions[k].default) : model.batchActions
  
      const renderActions = React.useCallback(actProps => {
        return actions ? actions.map((action, i) => {
          const Action = _.isString(action) && modelActions[action] ? modelActions[action].component : action
          if(Action) {
            return <Action key={`model--batch-action-${i}`} {...actProps} />
          }
          return null
        }).filter(Boolean) : null
      }, [ actions ])
  
      return { ...props, actions, renderActions }
    },
    'actons.batch_delete': props => {
      const { getModelState, modelDispatch, successMessage } = use('model', props)
      const { canDelete } = use('model.permission', props)

      const onBatchDelete = () => {
        const items = getModelState().selected
        return new Promise((resolve, reject) => {
          modelDispatch({ type: 'DELETE_ITEMS', items, 
            promise: { resolve, reject: err => {
              reject(err.formError || err.json)
            } }, message: successMessage })
        })
      }

      return { ...props, canDelete, onBatchDelete }
    },
    'actons.batch_change': props => {
      const { model, getModelState, modelDispatch, successMessage } = use('model', props)
      const { canEdit } = use('model.permission', props)

      const onBatchChange = (value) => {
        const items = getModelState().selected
        return new Promise((resolve, reject) => {
          modelDispatch({ type: 'SAVE_ITEMS', items, value, 
            promise: { resolve, reject: err => {
              reject(err.formError || err.json)
            } }, message: successMessage })
        })
      }

      return { ...props, fields: model.batchChangeFields || [], canEdit, onBatchChange }
    }
  },
  effects: function *() {
    yield all([
      takeEvery(action => action.model && action.type == 'DELETE_ITEMS' && action.success !== true, handle_delete_items),
      takeEvery(action => action.model && action.type == 'SAVE_ITEMS' && action.success !== true, handle_change_items)
    ])
  }
}
