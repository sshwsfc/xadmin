import _ from 'lodash'
import { app, config } from 'xadmin'
import { SubmissionError } from 'xadmin-form'
import { getFieldProp } from './utils'

export default {
  'model.items': {
    data: ({ modelState, model, state }, props, prev) => {
      const { ids, items } = modelState
      return {
        ids,
        itemMap: items,
        fields: modelState.filter.fields,
        loading: state.loading && state.loading[`${model.key}.items`]
      }
    },
    compute: ({ modelState, model }, props, prev) => {
      const { items, ids } = modelState
      return {
        items: ids === prev['ids'] ? prev['items'] : ids.map(id => items[id]).filter(item => !_.isNil(item))
      }
    },
    event: {
      mount: ({ dispatch, modelState, model }, { query }) => {
        let wheres
        if(query && Object.keys(query).length > 0) {
          wheres = { ...modelState.wheres, param_filter: query }
        } else {
          wheres = _.omit(modelState.wheres, 'param_filter')
        }
        if(!_.isEqual(wheres, modelState.wheres)) {
          dispatch({ model, type: 'GET_ITEMS', items: [], filter: { ...modelState.filter, skip: 0 }, success: true })
        }
        dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter }, wheres })
      }
    }
  },
  'model.list.header': {
    data: ({ modelState, model }, { field }) => {
      const orders = modelState.filter.order
        , property = getFieldProp(model, field) || {}
        , canOrder = (property.canOrder !== undefined ? property.canOrder : 
          ( property.orderField !== undefined || (property.type != 'object' && property.type != 'array')))
      return {
        canOrder,
        title: property.header || property.title || _.startCase(field),
        order: orders !== undefined ? (orders[property.orderField || field] || '') : ''
      }
    },
    method: {
      changeOrder: ({ dispatch, model, modelState }, { field }) => (order) => {
        const filter = modelState.filter
        const orders = filter.order || {}
        const property = getFieldProp(model, field) || {}
        orders[property.orderField || field] = order

        dispatch({ model, type: 'GET_ITEMS', filter: { ...filter, order: orders } })
      }
    }
  },
  'model.list.row': {
    data: ({ modelState, model }, { id }) => {
      let selected = false
      for (let i of modelState.selected) {
        if (i.id === id) {
          selected = true
          break
        }
      }
      return { 
        selected,
        item: modelState.items[id]
      }
    },
    compute: ({ model }, { item }) => {
      return {
        actions: model.itemActions,
        component: model.itemComponent,
        canEdit: !!model.permission && !!model.permission.edit && item && item._canEdit !== false,
        canDelete: !!model.permission && !!model.permission.delete && item && item._canDelete !== false
      }
    },
    method: {
      changeSelect: ({ dispatch, model, modelState }, { id }) => (selected) => {
        const item = modelState.items[id]
        dispatch({ model, type: 'SELECT_ITEMS', item, selected })
      },
      editItem: ({ model, modelState }, { id }) => () => {
        app.context.router.push(`/app/model/${model.name}/${encodeURIComponent(id)}/edit`)
      },
      deleteItem: ({ dispatch, model, modelState }, { id }) => () => {
        const item = modelState.items[id]
        dispatch({ model, type: 'DELETE_ITEM', item })
      }
    }
  },
  'model.list.item': {
    compute: ({ model }, { items, field, schema }) => {
      const property = schema || getFieldProp(model, field)
      const data = schema ? {} : { schema: property }
      const key = schema ? `${schema.name}.${field}` : field
      if(model.fieldRender == undefined) {
        model.fieldRender = {}
      }
      if(model.fieldRender[key] == undefined) {
        model.fieldRender[key] = property != undefined ? 
          app.get('fieldRenders').reduce((prev, render) => {
            return render(prev, property, field)
          }, null) : null
      }
      if(model.fieldRender[key]) {
        data['componentClass'] = model.fieldRender[key]
      }
      return data
    }
  }
}
