import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import _ from 'lodash'
import { app, config, use, api } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { getFieldProp } from './utils'
import { ModelContext, ModelStateContext } from './base'

export default {
  'model.store': ({ reducers, initial, value }) => {
    const [ state, dispatch ] = React.useReducer(reducers, initial)

    const subscribers = React.useRef([])

    const subscribe = func => {
      subscribers.current.push(func)
      return () => {
        const idx = subscribers.current.indexOf(func)
        if(idx != -1) {
          subscribers.current = subscribers.current.slice(idx, idx + 1)
        }
      }
    }
    
    const select = select => {

      const [ values, setValues ] = React.useState(select(state) || {})
      const lastValues = React.useRef()
      lastValues.current = values

      const updateState = (newState) => {
        const newValues = select(newState)
        if (!_.isEqual(lastValues.current, newValues)) {
          setValues(newValues)
        }
      }
      React.useEffect(() => {
        return subscribe(updateState)
      }, [])

      return values
    }

    const valueRef = React.useRef({
      select, dispatch, ...value
    })

    React.useEffect(() => {
      subscribers.current.forEach(func => func(state))
    }, [ state ])

    return valueRef.current
  },

  // model base hooks
  'model': (props, selector) => {
    const { model, dispatch, getState } = useContext(ModelContext)
    const rest = useMemo(() => api(model), [ model ])
    let values = { ...props, model,  dispatch, getState, rest }

    if(selector) {
      const state = useContext(ModelStateContext)
      values = { ...values, state, ...selector(state) }
    }

    return values
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
    const { model, rest, dispatch, successMessage } = use('model', props)
    const { dispatch: put } = use('redux')

    const saveItem = useCallback((item, partial, ...args) => {
      if(model.partialSave || item['__partial__']) {
        partial = true
      }
      return rest.save(item, partial)
        .then(data => {
          dispatch({ type: 'SAVE_ITEM', item: data || item, partial, success: true })
          if( successMessage !== false) {
            const object = model.title || model.name
            const noticeMessage = successMessage || (item.id == undefined ? 
              _t('Create {{object}} success', { object }) : 
              _t('Save {{object}} success', { object }))
            put({ type: '@@xadmin/ADD_NOTICE', payload: {
              type: 'success', headline: _t('Success'), message: noticeMessage
            } }) 
          }
        })
        .catch(err => {
          throw new Error(err.formError || err.json)
        })
    }, [ model ])

    return { ...props, model, saveItem }
  },
  // Delete Model Item
  'model.delete': props => {
    const { model, getState, dispatch, rest, message } = use('model', props)
    const { getItems } = use('model.getItems')
    const { dispatch: put } = use('redux')

    const deleteItem = useCallback((id) => {
      id = id || props.id
      const item = getState().items[id] || { id }
      return rest.delete(item.id)
        .then(() => {
          dispatch({ type: 'SELECT_ITEMS', selected: false, item })
          put({ type: '@@xadmin/ADD_NOTICE', payload: {
            type: 'success', headline: _t('Success'), message: message || _t('Delete {{object}} success', { object: model.title || model.name })
          } })
          getItems()
        })
    }, [ model, props.id ])

    return { ...props, model, deleteItem }
  },
  // Delete Model Item
  'model.getItems': props => {
    const { model, rest, getState, dispatch } = use('model', props)
    const { dispatch: put } = use('redux')

    const getItems = useCallback((filter, wheres) => {
      const state = getState()
      put({ type: 'START_LOADING', model, key: `${model.key}.items` })
      return rest.query(filter || state.filter, wheres || state.wheres)
        .then(({ items, total }) => {
          dispatch(({ type: 'GET_ITEMS', items: items || [], filter, wheres, count: total }))
          put({ type: 'END_LOADING', model, key: `${model.key}.items` })
          return { items, total }
        })
        .catch(err => {
          app.error(err)
          dispatch(({ type: 'GET_ITEMS', items: [], filter, wheres, count: 0 }))
          put({ type: 'END_LOADING', model, key: `${model.key}.items` })
        })
    }, [ dispatch ])

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
      onEdit: (id) => app.go(`/app/model/${model.name}/${encodeURIComponent(id || props.id)}/edit`),
      ...model.events
    }
  },

  // Model List Hooks
  'model.pagination': props => {
    const { count, limit, skip, getState, dispatch } = use('model', props,
      state => ({ 
        count: state.count, limit: state.filter.limit, skip: state.filter.skip 
      })
    )
    const { getItems } = use('model.getItems')
    
    const items = Math.ceil(count / limit)
    const activePage = Math.floor(skip / limit) + 1

    const changePage = useCallback((page) => {
      const filter = getState().filter
      const pageSize = filter.limit
        , skip = pageSize * (page - 1)
      getItems({ ...filter, skip: skip })
    }, [ getState, dispatch ])
    
    return { ...props, items, activePage, changePage }
  },
  'model.count': props => use('model', props, state => ({ count: state.count })),
  'model.pagesize': props => {
    const { size, getState, dispatch } = use('model', props, state => ({ size: state.filter.limit }) )
    const sizes = config('pageSizes', [ 15, 30, 50, 100 ])
    const { getItems } = use('model.getItems')

    const setPageSize = useCallback((size) => {
      const filter = getState().filter
      getItems({ ...filter, limit: size, skip: 0 })
    }, [ getState, dispatch ] )

    return { ...props, sizes, setPageSize, size }
  },
  'model.fields': props => {
    const { selected, model, getState, dispatch } = 
      use('model', props, state => ({ selected: state.filter.fields }))
    const { getItems } = use('model.getItems')

    const changeFieldDisplay = useCallback(([ field, selected ]) => {
      const filter = getState().filter
      const fields = [].concat(filter.fields || [])
      const index = _.indexOf(fields, field)

      if (selected) {
        if (index === -1) fields.push(field)
      } else {
        _.remove(fields, (i) => { return i === field })
      }
      const list = Array.from(new Set([ ...model.listFields, ...Object.keys(model.properties) ]))
      getItems({ ...filter, 
        fields: list.filter(f => fields.indexOf(f) >= 0) })
    }, [ getState, dispatch, model ] )

    return { ...props, fields: model.properties, changeFieldDisplay, selected }

  },
  'model.list': props => {
    const { ids, items: itemsMap, fields, selected, model, dispatch, state } = 
      use('model', props, state => ({ 
        ids: state.ids, items: state.items, fields: state.filter.fields
      }))
    const { getItems } = use('model.getItems')
    const { loading } = use('redux', state => ({ loading: state.loading && state.loading[`${model.key}.items`] }))

    useEffect(() => {
      if(model.initQuery == false) return
      
      let wheres
      const query = props && props.query
      if(query && Object.keys(query).length > 0) {
        wheres = { ...state.wheres, param_filter: query }
      } else {
        wheres = _.omit(state.wheres, 'param_filter')
      }
      if(!_.isEqual(wheres, state.wheres)) {
        dispatch({ type: 'GET_ITEMS', items: [], filter: { ...state.filter, skip: 0 }, success: true })
      }
      getItems({ ...state.filter }, wheres)
    }, [])

    const items = ids.map(id => itemsMap[id]).filter(item => !_.isNil(item))

    return { ...props, loading, items, fields, selected }
  },
  'model.actions': props => {
    const { model } = use('model', props)
    const modelActions = app.get('modelActions')
    const actions = model.itemActions === undefined ? 
      Object.keys(modelActions).filter(k => modelActions[k].default) : model.itemActions

    const renderActions = React.useCallback(actProps => {
      return actions ? actions.map((action, i) => {
        const Action = _.isString(action) && modelActions[action] ? modelActions[action].component : action
        if(Action) {
          return <Action key={`model-action-${i}`} {...actProps} />
        }
        return null
      }).filter(Boolean) : null
    }, [ actions ])

    return { ...props, actions, renderActions }
  },
  'model.select': props => {
    const { selected, ids, dispatch, state } = 
      use('model', props, state => ({ selected: state.selected, ids: state.ids }))

    const selects = selected.map(item => item.id)
    const isSelectedAll = _.every(ids, id => selects.indexOf(id) >= 0)

    const onSelectAll = useCallback((selected) => {
      if(selected) {
        const items = state.items
        dispatch({ type: 'SELECT_ITEMS', items: state.ids.map(id=>items[id]), selected })
      } else {
        dispatch({ type: 'SELECT_CLEAR' })
      }
    }, [ dispatch, state.items, state.ids ])

    const onSelect = useCallback((item, selected) => {
      dispatch({ type: 'SELECT_ITEMS', item, selected })
    }, [ dispatch ])

    return { ...props, count: selected.length, selected, isSelectedAll, onSelect, onSelectAll }
  },
  'model.list.row': props => {
    const { model, selected, item, dispatch } = use('model', props, state => {
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
      dispatch({ type: 'SELECT_ITEMS', item, selected })
    }, [ dispatch, item ])

    return { ...props, selected, item, changeSelect, actions: model.itemActions || [ 'edit', 'delete' ] }
  },
  'model.list.header': props => {
    const { field, model, filter, dispatch } = use('model', props, state => ({ filter: state.filter }))
    const { getItems } = use('model.getItems')

    const property = getFieldProp(model, field) || {}
    const canOrder = (property.canOrder !== undefined ? property.canOrder : 
      ( property.orderField !== undefined || (property.type != 'object' && property.type != 'array')))

    const changeOrder = useCallback((order) => {
      const orders = filter.order || {}
      const property = getFieldProp(model, field) || {}
      orders[property.orderField || field] = order

      getItems({ ...filter, order: orders })
    }, [ dispatch, filter ])

    const order = filter.order !== undefined ? (filter.order[property.orderField || field] || '') : ''
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
