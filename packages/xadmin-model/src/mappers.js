import React from 'react'
import _ from 'lodash'
import { app, config } from 'xadmin'
import { SubmissionError } from 'xadmin-form'

const getFieldProp = (model, field) => {
  return field.split('.').reduce((obj, f) => {
    return obj && obj.properties && obj.properties[f]
  }, model)
}

export default {
  'model.item': {
    data: ({ modelState, model, state }, { id, item }) => {
      return {
        loading: state.loading && state.loading[`${model.key}.get`],
        item: item || (id ? modelState.items[id] : undefined)
      }
    },
    compute: ({ model }, { id, query, item }) => {
      const { _t } = app.context
      return {
        title: id ? _t('Edit {{title}}', { title: model.title }) : _t('Create {{title}}', { title: model.title }),
        data: item || (_.isEmpty(query) ? undefined : query)
      }
    },
    method: {
      getItem: ({ dispatch, model }) => (id) => {
        if(id) {
          dispatch({ model, type: 'GET_ITEM', id })
        }
      },
      saveItem: ({ dispatch, model }, { successMessage }) => (item) => {
        return new Promise((resolve, reject) => {
          dispatch({ model, type: 'SAVE_ITEM', item, promise: { resolve, reject }, message: successMessage })
        }).catch(err => {
          throw new SubmissionError(err.json)
        })
      }
    },
    event: {
      mount: ({ dispatch, model }, { id, data }) => {
        if(data == undefined && id) {
          dispatch({ model, type: 'GET_ITEM', id })
        }
      },
      receiveProps: ({ dispatch, model }, { id, data }, nextProps) => {
        if(id != nextProps.id && nextProps.data == undefined) {
          dispatch({ model, type: 'GET_ITEM', id: nextProps.id })
        }
      }
    }
  },
  'model.items': {
    data: ({ modelState, model, state }, props, prev) => {
      const { ids } = modelState
      return {
        ids,
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
  'model.checkall': {
    data: ({ modelState, model, state }, props, prev) => {
      const { selected, items } = modelState
      return { selected, items }
    },
    compute: ({ modelState, model }, props, prev) => {
      const { selected, ids } = modelState
      const selects = selected.map(item => item.id)
      return {
        selecteall: _.every(ids, id => selects.indexOf(id) >= 0)
      }
    },
    method: {
      changeAllSelect: ({ dispatch, modelState, model }) => (selected) => {
        if(selected) {
          const items = modelState.items
          dispatch({ model, type: 'SELECT_ITEMS', items: modelState.ids.map(id=>items[id]), selected })
        } else {
          dispatch({ model, type: 'SELECT_CLEAR' })
        }
      }
    }
  },
  'model.list.pagination': {
    data: ({ modelState }) => {
      const count = modelState.count
      const { limit, skip } = modelState.filter
      
      return {
        items: Math.ceil(count / limit),
        activePage: Math.floor(skip / limit) + 1
      }
    },
    method: {
      changePage: ({ dispatch, modelState, model }) => (page) => {
        const pageSize = modelState.filter.limit
          , skip = pageSize * (page - 1)
        dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter, skip: skip } })
      }
    }
  },
  'model.list.header': {
    data: ({ modelState, model }, { field }) => {
      const orders = modelState.filter.order
        , property = getFieldProp(model, field) || {}
        , canOrder = (property.canOrder == undefined ? true : property.canOrder) && 
          ( property.orderField !== undefined || (property.type != 'object' && property.type != 'array') )
      return {
        canOrder,
        title: property.title || _.startCase(field),
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
        actions: model.item_actions,
        component: model.item_component,
        canEdit: !!model.permission && !!model.permission.edit && item && item._canEdit !== false,
        canDelete: !!model.permission && !!model.permission.delete && item && item._canDelete !== false
      }
    },
    method: {
      changeSelect: ({ dispatch, model, modelState }, { id }) => (selected) => {
        const item = modelState.items[id]
        dispatch({ model, type: 'SELECT_ITEMS', item, selected })
      },
      editItem: ({ router, model, modelState }, { id }) => () => {
        router.push(`/app/model/${model.name}/${id}/edit`)
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
      if(model.fields_render == undefined) {
        model.fields_render = {}
      }
      if(model.fields_render[field] == undefined) {
        model.fields_render[field] = property != undefined ? 
          app.load_list('field_render').reduce((prev, render) => {
            return render(prev, property, field)
          }, null) : null
      }
      if(model.fields_render[field]) {
        data['componentClass'] = model.fields_render[field]
      }
      return data
    }
  },
  'model.list.actions': {
    data: ({ modelState }) => {
      return { count: modelState.selected.length, selected: modelState.selected }
    }
  },
  'model.list.btn.count': {
    data: ({ modelState }) => {
      return { count: modelState.count }
    }
  },
  'model.list.btn.pagesize': {
    data: ({ modelState }) => {
      return { size: modelState.filter.limit, sizes: config('pageSizes', [ 15, 30, 50, 100 ]) }
    },
    method: {
      setPageSize: ({ dispatch, model, modelState }) => (size) => {
        dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter, limit: size, skip: 0 } })
      }
    }
  },
  'model.list.btn.cols': {
    data: ({ modelState, model }) => {
      return {
        selected: modelState.filter.fields,
        fields: model.properties
      }
    },
    method: {
      changeFieldDisplay: ({ dispatch, model, modelState }) => (e) => {
        const filter = modelState.filter
        const fields = [].concat(filter.fields || [])
        const field = e[0]
        const selected = e[1]
        const index = _.indexOf(fields, field)

        if (selected) {
          if (index === -1) fields.push(field)
        } else {
          _.remove(fields, (i) => { return i === field })
        }
        dispatch({ model, type: 'GET_ITEMS', filter: { ...filter, fields } })
      }
    }
  },
  'model.page.list': {
    data: ({ model }) => {
      return {
        icon: model.icon || model.name,
        title: model.title,
        canAdd: !!model.permission && !!model.permission.add
      }
    },
    method: {
      addItem: ({ router, model }, { location }) => () => {
        router.push({ pathname: `/app/model/${model.name}/add`, query: (location && location.query) || {} })
      }
    }
  },
  'model.page.form': {
    data: ({ modelState, model }, { params }) => {
      const { _t } = app.context
      return {
        title: params && params.id ?  _t('Edit {{title}}', { title: model.title }) : _t('Create {{title}}', { title: model.title })
      }
    },
    method: {
      onSuccess: ({ dispatch, router }) => () => {
        router.goBack()
      }
    }
  }
}
