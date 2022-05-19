import React from 'react'
import _ from 'lodash'
import app, { use } from 'xadmin'
import { C } from 'xadmin-ui'
import { _t } from 'xadmin-i18n'
import * as atoms from './atoms'
import {  useRecoilCallback, useRecoilValue } from 'recoil'


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
    'model.batchActions': () => {
      const { model } = use('model')
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
  
      return { actions, renderActions }
    },
    'actons.batch_delete': ({ successMessage }) => {
      const { model, rest } = use('model')
      const { getItems } = use('model.getItems')
      const message = use('message')
      const { canDelete } = use('model.permission')
      const loading = useRecoilValue(atoms.loading('delete_items'))

      const onBatchDelete = useRecoilCallback(({ snapshot, set, reset }) => async () => {
        const items = snapshot.getLoadable(atoms.selected).contents

        set(atoms.loading('delete_items'), true)
        try {
          if(rest.batchSave) {
            await rest.batchSave(items.map(item=>item.id))
          } else {
            await Promise.all(items.map(item => rest.delete(item.id)))
          }

          // clear selected
          reset(atoms.selected)

          // show message
          if(message?.success &&  successMessage !== false) {
            const object = model.title || model.name
            const noticeMessage = _.isString(successMessage) ? successMessage :  _t('Delete {{object}} success', { object })
            message?.success(noticeMessage) 
          }
          // get items
          getItems()

          return null
        } catch(err) {
          app.error(err)
          throw err.formError || err.json || err
        } finally {
          set(atoms.loading('delete_items'), false)
        }
      }, [ getItems, model ])

      return { loading, canDelete, onBatchDelete }
    },
    'actons.batch_change': ({ successMessage }) => {
      const { model, rest } = use('model')
      const { getItems } = use('model.getItems')
      const message = use('message')
      const { canEdit } = use('model.permission')
      const loading = useRecoilValue(atoms.loading('save_items'))

      const onBatchChange = useRecoilCallback(({ snapshot, set }) => async (value) => {
        const items = snapshot.getLoadable(atoms.selected).contents

        set(atoms.loading('save_items'), true)
        try {
          let ret
          if(rest.batchDelte) {
            ret = await rest.batchDelte(items, value)
          } else {
            ret = await Promise.all(items.map(item => rest.save({ id: item.id, ...value }, true)))
          }

          // show message
          if(message?.success &&  successMessage !== false) {
            const object = model.title || model.name
            const noticeMessage = _.isString(successMessage) ? successMessage : _t('Batch Save {{object}} success', { object })
            message?.success(noticeMessage) 
          }
          // update items
          if(_.isNil(ret) || _.isEmpty(ret)) {
            getItems()
          } else {
            ret.forEach(item => set(atoms.item(item.id), item))
          }

          return ret
        } catch(err) {
          app.error(err)
          throw err.formError || err.json || err
        } finally {
          set(atoms.loading('save_items'), false)
        }

      }, [ getItems, model ])

      return { loading, fields: model.batchChangeFields || [], canEdit, onBatchChange }
    }
  }
}
