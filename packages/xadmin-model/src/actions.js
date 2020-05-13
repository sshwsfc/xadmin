import React from 'react'
import _ from 'lodash'
import app, { use } from 'xadmin'
import { C } from 'xadmin-ui'

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
      const { model, rest, getState, dispatch } = use('model', props)
      const { getItems } = use('model.getItems')
      const { canDelete } = use('model.permission', props)
      const { dispatch: put } = use('redux')

      const batchDelete = React.useCallback(async () => {
        const items = getState().selected
        put({ type: 'START_LOADING', model, key: `${model.key}.delete_items` })
        
        try {
          if(rest.batchDelte) {
            await rest.batchDelte(items.map(item=>item.id))
          } else {
            await Promise.all(items.map(item => rest.delete(item.id)))
          }
          for(let item of items) {
            dispatch({ type: 'SELECT_ITEMS', selected: false, item })
          }
          await getItems()
        } catch(err) {
          app.error(err)
        }
      
        put({ type: 'END_LOADING', model, key: `${model.key}.delete_items` })
      }, [ model ])

      return { ...props, canDelete, batchDelete }
    },
    'actons.batch_change': props => {
      const { canEdit } = use('model.permission', props)
      const { model, rest, getState, successMessage: message } = use('model', props)
      const { getItems } = use('model.getItems')
      const { dispatch: put } = use('redux')

      const batchChange = React.useCallback(async (value) => {
        const items = getState().selected

        put({ type: 'START_LOADING', model, key: `${model.key}.save_items` })

        const { _t } = app.context
        let ret

        try {
          if(rest.batchSave) {
            ret = await rest.batchSave(items, value)
          } else {
            ret = await Promise.all(items.map(item => rest.save({ id: item.id, ...value }, true)))
          }
          await getItems()

          if( message !== false) {
            const object = model.title || model.name
            const noticeMessage = message || _t('Batch Save {{object}} success', { object })
            put({ type: '@@xadmin/ADD_NOTICE', payload: {
              type: 'success', headline: 'Success', message: noticeMessage
            } }) 
          }
        } catch(err) {
          throw new Error(err.json)
        }

        put({ type: 'END_LOADING', model , key: `${model.key}.save_items` })

        return ret
      })

      return { ...props, fields: model.batchChangeFields || [], canEdit, batchChange }
    }
  }
}
