import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import _ from 'lodash'
import { app, config, use, api } from 'xadmin'
import { SubmissionError } from 'xadmin-form'
import { _t } from 'xadmin-i18n'
import { getFieldProp } from './utils'
import { ModelContext } from './base'

export default {
  'model': (props, select) => {
    const model = props.model || useContext(ModelContext)
    const rest = useMemo(() => api(model), [ model ])

    const { dispatch, store, state, ...values } = select ? 
      use('redux', state => select(model ? state.model[model.key] : {})) : use('redux')

    return { ...props, model, rest, ...values,
      modelState: model ? state.model[model.key] : {},
      getModelState: useCallback(() => model ? store.getState().model[model.key] : {}, [ model, store ]),
      modelDispatch: useCallback(action => dispatch({ ...action, model }), [ model, dispatch ])
    }
  },
  // Get Model Item
  'model.get': props => {
    const { model, rest, id, query, item } = use('model', props)

    const [ state, setState ] = useState(() => {
      let data = item
      if(!data) {
        if(model.defaultValue) {
          data = _.isFunction(model.defaultValue) ? model.defaultValue() : model.defaultValue
        }
        if(!_.isEmpty(query)) {
          data = { ...data, ...query }
        }
      }
      return { data, loading: Boolean(!data && id) }
    })
  
    useEffect(() => {
      const { data } = state
      if((!data && id) || ( data && data.id != id) ) {
        setState({ data, loading: true })
        rest.get(id).then(payload => {
          setState({ data: payload, loading: false })
        })
      }
    }, [ id ])

    const title = id ? _t('Edit {{title}}', { title: model.title }) : _t('Create {{title}}', { title: model.title })

    return { ...props, model, title, ...state }
  },
  // Save Model Item
  'model.save': props => {
    const { model, modelDispatch, successMessage } = use('model', props)

    const saveItem = useCallback((item, partial, ...args) => {
      return new Promise((resolve, reject) => {
        modelDispatch({ type: 'SAVE_ITEM', item, partial, promise: { resolve, reject }, message: successMessage })
      }).catch(err => {
        throw new SubmissionError(err.formError || err.json)
      })
    }, [ model ])

    return { ...props, model, saveItem }
  },
  // Delete Model Item
  'model.delete': props => {
    const { model, getModelState, modelDispatch } = use('model', props)

    const deleteItem = useCallback((id) => {
      id = id || props.id
      const item = getModelState().items[id] || { id }
      modelDispatch({ type: 'DELETE_ITEM', item })
    }, [ model, props.id ])

    return { ...props, model, deleteItem }
  },
  // Delete Model Item
  'model.getItems': props => {
    const { model, modelDispatch } = use('model', props)

    const getItems = useCallback(() => {
      modelDispatch({ type: 'GET_ITEMS' })
    }, [ modelDispatch ])

    return { ...props, model, getItems }
  },
  // Model Item hooks
  'model.item': props => {
    return {
      ...props,
      ...use('model.get', props),
      ...use('model.save', props),
      ...use('model.delete', props)
    }
  },
  'model.query': props => {
    const { model, rest } = use('model', props)

    const [ data, setData ] = useState(null)
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
      setLoading(true)
      rest.query().then(({ items, count }) => {
        setData(items)
        setLoading(false)
      })
    }, [ ])

    return { ...props, items: data, loading, model }
  },
  'model.permission': props => {
    const { model } = use('model', props)
    return {
      ...props,
      canAdd: !!model.permission && !!model.permission.add,
      canDelete: !!model.permission && !!model.permission.delete,
      canEdit: !!model.permission && !!model.permission.edit
    }
  },
  'model.event': props => {
    const { model } = use('model', props)
    return {
      ...props,
      onAdd: () => app.go(`/app/model/${model.name}/add`),
      onSaved: () => (history && history.length > 1) && history.back() || app.go(`/app/model/${model.name}/list`),
      onBack: () => (history && history.length > 1) && history.back() || app.go(`/app/model/${model.name}/list`),
      onEdit: (id) => app.go(`/app/model/${model.name}/${encodeURIComponent(id || props.id)}/edit`)
    }
  },

  // Model List Hooks
  'model.pagination': props => {
    const { count, limit, skip, modelState, modelDispatch } = use('model', props,
      state => ({ 
        count: state.count, limit: state.filter.limit, skip: state.filter.skip 
      })
    )
    
    const items = Math.ceil(count / limit)
    const activePage = Math.floor(skip / limit) + 1

    const changePage = useCallback((page) => {
      const pageSize = modelState.filter.limit
        , skip = pageSize * (page - 1)
      modelDispatch({ type: 'GET_ITEMS', filter: { ...modelState.filter, skip: skip } })
    }, [ modelState.filter, modelDispatch ] )
    
    return { ...props, items, activePage, changePage }
  },
  'model.count': props => use('model', props, state => ({ count: state.count })),
  'model.pagesize': props => {
    const { size, modelState, modelDispatch } = use('model', props, state => ({ size: state.filter.limit }) )
    const sizes = config('pageSizes', [ 15, 30, 50, 100 ])

    const setPageSize = useCallback((size) => {
      modelDispatch({ type: 'GET_ITEMS', filter: { ...modelState.filter, limit: size, skip: 0 } })
    }, [ modelState.filter, modelDispatch ] )

    return { ...props, sizes, setPageSize, size }
  },
  'model.fields': props => {
    const { selected, model, modelState, modelDispatch } = 
      use('model', props, state => ({ selected: state.filter.fields }))

    const changeFieldDisplay = useCallback(([ field, selected ]) => {
      const filter = modelState.filter
      const fields = [].concat(filter.fields || [])
      const index = _.indexOf(fields, field)

      if (selected) {
        if (index === -1) fields.push(field)
      } else {
        _.remove(fields, (i) => { return i === field })
      }
      const list = Array.from(new Set([ ...model.listFields, ...Object.keys(model.properties) ]))
      modelDispatch({ type: 'GET_ITEMS', filter: { ...filter, 
        fields: list.filter(f => fields.indexOf(f) >= 0) } })
    }, [ modelState.filter, modelDispatch, model ] )

    return { ...props, fields: model.properties, changeFieldDisplay, selected }

  },
  'model.list': props => {
    const { ids, items: itemsMap, fields, selected, model, modelDispatch, modelState } = 
      use('model', props, state => ({ 
        ids: state.ids, items: state.items, fields: state.filter.fields
      }))

    const { loading } = use('redux', state => ({ loading: state.loading && state.loading[`${model.key}.items`] }))

    useEffect(() => {
      let wheres
      const query = props && props.query
      if(query && Object.keys(query).length > 0) {
        wheres = { ...modelState.wheres, param_filter: query }
      } else {
        wheres = _.omit(modelState.wheres, 'param_filter')
      }
      if(!_.isEqual(wheres, modelState.wheres)) {
        modelDispatch({ type: 'GET_ITEMS', items: [], filter: { ...modelState.filter, skip: 0 }, success: true })
      }
      modelDispatch({ type: 'GET_ITEMS', filter: { ...modelState.filter }, wheres })
    }, [])

    const items = ids.map(id => itemsMap[id]).filter(item => !_.isNil(item))

    return { ...props, loading, items, fields, selected }
  },
  'model.select': props => {
    const { selected, ids, modelDispatch, modelState } = 
      use('model', props, state => ({ selected: state.selected, ids: state.ids }))

    const selects = selected.map(item => item.id)
    const isSelectedAll = _.every(ids, id => selects.indexOf(id) >= 0)

    const onSelectAll = useCallback((selected) => {
      if(selected) {
        const items = modelState.items
        modelDispatch({ type: 'SELECT_ITEMS', items: modelState.ids.map(id=>items[id]), selected })
      } else {
        modelDispatch({ type: 'SELECT_CLEAR' })
      }
    }, [ modelDispatch, modelState.items, modelState.ids ])

    const onSelect = useCallback((item, selected) => {
      modelDispatch({ type: 'SELECT_ITEMS', item, selected })
    }, [ modelDispatch ])

    return { ...props, count: selected.length, selected, isSelectedAll, onSelect, onSelectAll }
  },
  'model.list.row': props => {
    const { model, selected, item, modelDispatch } = use('model', props, state => {
      let selected = false
      for (let i of state.selected) {
        if (i.id === props.id) {
          selected = true
          break
        }
      }
      return { 
        selected,
        item: state.items[props.id]
      }
    })

    const changeSelect = useCallback((selected) => {
      modelDispatch({ type: 'SELECT_ITEMS', item, selected })
    }, [ modelDispatch, item ])

    return { ...props, selected, item, changeSelect, actions: model.itemActions }
  },
  'model.list.header': props => {
    const { field, model, modelState, modelDispatch } = use('model', props)

    const property = getFieldProp(model, field) || {}
    const canOrder = (property.canOrder !== undefined ? property.canOrder : 
      ( property.orderField !== undefined || (property.type != 'object' && property.type != 'array')))

    const changeOrder = useCallback((order) => {
      const filter = modelState.filter
      const orders = filter.order || {}
      const property = getFieldProp(model, field) || {}
      orders[property.orderField || field] = order

      modelDispatch({ type: 'GET_ITEMS', filter: { ...filter, order: orders } })
    }, [ modelDispatch, modelState.filter ])

    const { order } = use('model', props, state => {
      const orders = state.filter.order
      return { order: orders !== undefined ? (orders[property.orderField || field] || '') : '' }
    })

    const title = property.header || property.title || _.startCase(field)

    return { ...props, title, changeOrder, canOrder, order, property }
  },
  'model.list.item': props => {
    const { model, schema, field, item, nest } = use('model', props)
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
    data['value'] = _.get(item, field)
    data['editable'] = nest == true || model.editableFields == undefined || model.editableFields.indexOf(field) < 0

    return { ...props, ...data, model }
  }

}
