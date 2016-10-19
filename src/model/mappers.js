import _ from 'lodash'

export default {
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
  'model.list': {
    data: ({ model }) => {
      return {
        icon: model.icon || model.name,
        title: model.title
      }
    },
    method: {
      addModel: ({ router, model }) => () => {
        router.push(model.$link.add.path)
      }
    }
  },
  'model.list.grid': {
    data: ({ modelState, model }) => {
      return {
        items: modelState.items,
        fields: modelState.filter.fields
      }
    }
  },
  'model.list.header': {
    data: ({ modelState }, { field }) => {
      const orders = modelState.filter.order
      return {
        order: orders !== undefined ? (orders[field] || '') : ''
      }
    },
    method: {
      changeOrder: ({ dispatch, model, modelState }, { field }) => (order) => {
        const filter = modelState.filter
        const orders = filter.order || {}
        orders[field] = order

        dispatch({ model, type: 'GET_ITEMS', filter: { ...filter, order: orders } })
      }
    }
  },
  'model.list.row': {
    data: ({ modelState }, { item }) => {
      let selected = false
      for (let i of modelState.selected) {
        if (i.id === item.id) {
          selected = true
          break
        }
      }
      return { selected }
    },
    method: {
      changeSelect: ({ dispatch, model }, { item }) => (selected) => {
        dispatch({ model, type: 'SELECT_ITEMS', item, selected })
      },
      editItem: ({ router, model }, { item }) => () => {
        router.push(`/model/${model.name}/${item.id}/edit`)
      },
      deleteItem: ({ dispatch, model }, { item }) => () => {
        dispatch({ model, type: 'DELETE_ITEM', item })
      }
    }
  },
  'model.list.actions': {
    data: ({ modelState }) => {
      return { count: modelState.selected.length }
    }
  },
  'model.list.btn.count': {
    data: ({ modelState }) => {
      return { count: modelState.count }
    }
  },
  'model.list.btn.cols': {
    data: ({ modelState, model }) => {
      return {
        selected: modelState.filter.fields,
        fields: model.schema.properties
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
  }
}
