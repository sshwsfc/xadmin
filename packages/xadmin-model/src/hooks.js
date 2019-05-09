import React from 'react'
import _ from 'lodash'
import { app, config, use, api } from 'xadmin'
import { SubmissionError } from 'xadmin-form'
import { _t } from 'xadmin-i18n'
import { getFieldProp } from './utils'
import { ModelContext } from './base'

export default {
  'model': props => {
    const model = React.useContext(ModelContext)

    if(props && props.select) {
      const { dispatch, ...values } = use('redux', {
        select: state => props.select(model ? state.model[model.key] : {})
      })

      return { ...props, model, rest: api(model), ...values,
        modelDispatch: action => dispatch({ ...action, model })
      }
    } else {
      const { state, dispatch } = use('redux')

      return { ...props, model, rest: api(model),
        modelState: model ? state.model[model.key] : {},
        modelDispatch: action => dispatch({ ...action, model })
      }
    }
  },
  // Get Model Item
  'model.get': props => {
    const { model, rest } = use('model')
    const { id, query, item } = props

    const [ data, setData ] = React.useState(item)
    const [ loading, setLoading ] = React.useState(id && item == null)
  
    React.useEffect(() => {
      let data = item

      if(!data) {
        if(model.defaultValue) {
          data = _.isFunction(model.defaultValue) ? model.defaultValue() : model.defaultValue
        }
        if(!_.isEmpty(query)) {
          data = { ...data, ...query }
        }
      }

      if(!data && id) {
        setLoading(true)
        rest.get(id).then(payload => {
          setData(payload)
          setLoading(false)
        })
      } else {
        setData(data)
      }

    }, [ id, item, query ])

    const title = id ? _t('Edit {{title}}', { title: model.title }) : _t('Create {{title}}', { title: model.title })

    return { ...props, model, data, title, loading }
  },
  // Save Model Item
  'model.save': props => {
    const { dispatch } = use('redux')
    const { model, rest } = use('model')

    const saveItem = (item) => {
      return rest.save(item).then(() => dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
        type: 'success', headline: _t('Success'), message: _t('Save {{object}} success', { object: model.title || model.name })
      } })).catch(err => {
        throw new SubmissionError(err.formError || err.json)
      })
    }

    return { ...props, saveItem }
  },
  // Delete Model Item
  'model.delete': props => {
    const { dispatch } = use('redux')
    const { model, rest } = use('model')

    const deletItem = (id) => {
      rest.delete(id).then(() => dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
        type: 'success', headline: _t('Success'), message: _t('Delete {{object}} success', { object: model.title || model.name })
      } }))
    }

    return { ...props, deletItem }
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
    return props
  },
  'model.permission': props => {
    const { model } = use('model')
    return {
      ...props,
      canAdd: !!model.permission && !!model.permission.add,
      canDelete: !!model.permission && !!model.permission.delete,
      canEdit: !!model.permission && !!model.permission.edit
    }
  },
  'model.event': props => {
    const { model } = use('model')
    return {
      ...props,
      onAdd: () => app.go(`/app/model/${model.name}/add`),
      onSave: () => app.go(`/app/model/${model.name}/list`),
      onBack: () => app.go(`/app/model/${model.name}/list`),
      onEdit: (id) => app.go(`/app/model/${model.name}/${id || props.id}/edit`)
    }
  },

  // Model List Hooks
  'model.actions': props => {
    return { ...props, ...use('model', {
      select: state => ({ count: state.selected.length, selected: state.selected })
    }) }
  },
  'model.pagination': props => {
    const { count, limit, skip } = use('model', {
      select: state => ({ 
        count: state.count, limit: state.filter.limit, skip: state.filter.skip 
      })
    })
    const { modelState, modelDispatch } = use('model')
    
    const items = Math.ceil(count / limit)
    const activePage = Math.floor(skip / limit) + 1

    const changePage = (page) => {
      const pageSize = modelState.filter.limit
        , skip = pageSize * (page - 1)
      modelDispatch({ type: 'GET_ITEMS', filter: { ...modelState.filter, skip: skip } })
    }
    
    return { ...props, items, activePage, changePage }
  },
  'model.count': props => {
    return { ...props, ...use('model', {
      select: state => ({ count: state.count })
    }) }
  },
  'model.pagesize': props => {
    const { modelState, modelDispatch } = use('model')
    const sizes = config('pageSizes', [ 15, 30, 50, 100 ])

    const setPageSize = (size) => {
      modelDispatch({ type: 'GET_ITEMS', filter: { ...modelState.filter, limit: size, skip: 0 } })
    }

    return { ...props, sizes, setPageSize, ...use('model', {
      select: state => ({ size: state.filter.limit })
    }) }
  },
  'model.fields': props => {
    const { model, modelState, modelDispatch } = use('model')

    const changeFieldDisplay = ([ field, selected ]) => {
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
    }

    return { ...props, fields: model.properties, changeFieldDisplay, ...use('model', {
      select: state => ({ selected: state.filter.fields })
    }) }

  },
  'model.grid': props => {
    const { ids, items: itemsMap, fields, selected } = use('model', {
      select: state => ({ 
        ids: state.ids,
        items: state.items,
        selected: state.selected,
        fields: state.filter.fields
      })
    })
    const { model, modelDispatch, modelState } = use('model')

    const { loading } = use('redux', {
      select: state => ({ loading: state.loading && state.loading[`${model.key}.items`] })
    })

    React.useEffect(() => {
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

    const selects = selected.map(item => item.id)
    const isSelectedAll = _.every(ids, id => selects.indexOf(id) >= 0)

    const onSelectAll = (selected) => {
      if(selected) {
        const items = modelState.items
        modelDispatch({ type: 'SELECT_ITEMS', items: modelState.ids.map(id=>items[id]), selected })
      } else {
        modelDispatch({ type: 'SELECT_CLEAR' })
      }
    }

    const onSelect = (item, selected) => {
      modelDispatch({ type: 'SELECT_ITEMS', item, selected })
    }

    const items = ids.map(id => itemsMap[id]).filter(item => !_.isNil(item))

    return { ...props, loading, items, fields, selected, isSelectedAll, onSelect, onSelectAll }
  }

}
