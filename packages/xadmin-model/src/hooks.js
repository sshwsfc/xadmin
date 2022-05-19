import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import _ from 'lodash'
import { app, config, use, api } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { getFieldProp } from './utils'
import { ModelContext } from './base'
import * as atoms from './atoms'
import {
  useRecoilState,
  useRecoilValue, useSetRecoilState, useRecoilCallback
} from 'recoil'

export default {
  'model': (props) => {
    const model = props.model || useContext(ModelContext)
    const rest = useMemo(() => api(model), [ model ])
    return { ...props, model, rest }
  },
  // Get Model Item
  'model.get': props => {
    const { model, rest, id, query, item } = use('model', props)

    const defaultData = React.useMemo(() => {
      let data = item
      if(!data) {
        if(model.defaultValue) {
          data = _.isFunction(model.defaultValue) ? model.defaultValue() : model.defaultValue
        }
        if(!_.isEmpty(query)) {
          data = { ...data, ...query }
        }
      }
      return data
    }, [ item, model.defaultValue, query ])

    const [ state, setState ] = useState(() => ({ data: defaultData, loading: Boolean(!defaultData && id) }))
  
    useEffect(() => {
      const { data } = state
      if(id && data?.id != id ) {
        setState({ data, loading: true })
        rest.get(id).then(payload => {
          setState({ data: payload, loading: false })
        })
      } else {
        setState({ data: defaultData, loading: false })
      }
    }, [ id ])

    const title = id ? _t('Edit {{title}}', { title: model.title }) : _t('Create {{title}}', { title: model.title })

    return { ...props, model, title, ...state }
  },
  // Save Model Item
  'model.save': props => {
    const { model, rest } = use('model', props)
    const { successMessage } = props
    const message = use('message')

    const saveItem = useRecoilCallback(({ set }) => async (item, partial) => {
      set(atoms.loading('save'), true)
      try {
        if(model.partialSave || item['__partial__']) {
          partial = true
        }
        const data = await rest.save(item, partial)
        set(atoms.item(data.id || item.id), data || item)
        if( message?.success && successMessage !== false) {
          const object = model.title || model.name
          const noticeMessage = successMessage || (item.id == undefined ? 
            _t('Create {{object}} success', { object }) : 
            _t('Save {{object}} success', { object }))
          message.success(noticeMessage)
        }
        return data
      } catch(err) {
        app.error(err)
        throw err.formError || err.json || err
      } finally {
        set(atoms.loading('save'), false)
      }
    }, [ model ])

    return { ...props, model, saveItem }
  },
  // Delete Model Item
  'model.delete': props => {
    const { model, rest } = use('model', props)
    const { getItems } = use('model.getItems')
    const message = use('message')

    const deleteItem = useRecoilCallback(({ snapshot, set }) => async (id) => {
      id = id || props.id
      await rest.delete(id)
      // unselect
      const selected = snapshot.getLoadable(atoms.selected).contents
      set(atoms.selected, selected.filter(i => { return i.id !== id }))
      message?.success && message.success(props.message || _t('Delete {{object}} success', { object: model.title || model.name }))
      // getItems
      await getItems()
    }, [ model, props.id ])

    return { ...props, model, deleteItem }
  },
  // Delete Model Item
  'model.getItems': props => {
    const { model, rest } = use('model', props)

    const getItems = useRecoilCallback(({ snapshot: ss, set, reset }) => async (query) => {
      let { wheres: newWheres, ...newOption } = query || {}
      const wheres = newWheres || ss.getLoadable(atoms.wheres).content
      const option = { ...ss.getLoadable(atoms.option).contents, ...newOption }
      
      set(atoms.loading('items'), true)
      try {
        let { items, total } = await rest.query(option, wheres)

        set(atoms.items, items)
        set(atoms.count, total)

        if(!_.isEmpty(newOption)) set(atoms.option, option)
        if(newWheres) set(atoms.wheres, wheres)

        return { items, total }
      } catch (error) {
        app.error(error)

        reset(atoms.ids)
        reset(atoms.count)

        throw error
      } finally {
        set(atoms.loading('items'), false)
      }
    });

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
    const nav = use('navigate')
    return {
      ...props,
      onAdd: () => nav(`../add`),
      onSaved: () => (history && history.length > 1) && history.back() || nav(`../`),
      onBack: () => (history && history.length > 1) && history.back() || nav(-1),
      onEdit: (id) => nav(`../${encodeURIComponent(id || props.id)}/edit`),
      ...model.events
    }
  },
  // Model effect hook
  'model.effect': () => {
    const { getItems } = use('model.getItems')
    const option = useRecoilValue(atoms.option)
    const wheres = useRecoilValue(atoms.wheres)

    React.useEffect(() => {
      getItems()
    }, [ option, wheres ])

    return null
  },
  'model.pagination': props => {
    const count = useRecoilValue(atoms.count)
    const limit = useRecoilValue(atoms.limit)
    const [ skip, setSkip ] = useRecoilState(atoms.skip)
    
    const items = Math.ceil(count / limit)
    const activePage = Math.floor(skip / limit) + 1

    const changePage = useCallback((page) => {
      const skip = limit * (page - 1)
      setSkip(skip)
    }, [ setSkip, limit ])
    
    return { ...props, items, activePage, changePage }
  },
  'model.count': props => ({ ...props, count: useRecoilValue(atoms.count) }),
  'model.pagesize': props => {
    const [limit, setLimit] = useRecoilState(atoms.limit)
    const setSkip = useSetRecoilState(atoms.skip)

    const sizes = config('pageSizes', [ 15, 30, 50, 100 ])

    const setPageSize = useCallback((size) => {
      setLimit(size)
      setSkip(0)
    }, [ setLimit, setSkip ] )

    return { ...props, sizes, setPageSize, size: limit }
  },
  'model.fields': props => {
    const { model } = use('model', props)
    const [ selectedFields, setFields ] = useRecoilState(atoms.fields)

    const changeFieldDisplay = useCallback(([ field, selected ]) => {
      const fs = [ ...selectedFields ]
      const index = _.indexOf(fs, field)

      if (selected) {
        if (index === -1) fs.push(field)
      } else {
        _.remove(fs, (i) => { return i === field })
      }
      const list = Array.from(new Set([ ...model.listFields, ...Object.keys(model.properties) ]))
      setFields(list.filter(f => fs.indexOf(f) >= 0))
    }, [ selectedFields, model, setFields ] )

    return { ...props, fields: model.properties, changeFieldDisplay, selected: selectedFields }

  },
  'model.list': props => {
    const items = useRecoilValue(atoms.items)
    const selected = useRecoilValue(atoms.selected)
    const fields = useRecoilValue(atoms.fields)
    const loading = useRecoilValue(atoms.loading('items'))

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
    const selected = useRecoilValue(atoms.selected)
    const [isSelectedAll, onSelectAll] = useRecoilState(atoms.allSelected)

    const onSelect = useRecoilCallback(({ set }) => (item, isSelect) => {
      set(atoms.itemSelected(item.id), isSelect)
    }, [ ])

    return { ...props, count: selected.length, selected, isSelectedAll, onSelect, onSelectAll }
  },
  'model.list.row': props => {
    const { model } = use('model', props)
    const item = useRecoilValue(atoms.item(props.id))
    const [ itemSelected, changeSelect ] = useRecoilState(atoms.itemSelected(props.id))

    return { ...props, selected: itemSelected, item, changeSelect, actions: model.itemActions || [ 'edit', 'delete' ] }
  },
  'model.list.header': props => {
    const { model } = use('model', props)
    const field = props.field
    const property = getFieldProp(model, field) || {}
    const title = property.header || property.title || _.startCase(field)

    return { ...props, title }
  },
  'model.list.order': props => {
    const { model } = use('model', props)
    const field = props.field
    const property = getFieldProp(model, field) || {}
    const canOrder = (property.canOrder !== undefined ? property.canOrder : 
      ( property.orderField !== undefined || (property.type != 'object' && property.type != 'array')))
    const [itemOrder, changeOrder] = useRecoilState(atoms.itemOrder(field))

    return { ...props, changeOrder, canOrder, order: itemOrder }
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
