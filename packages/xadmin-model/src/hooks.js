import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import _ from 'lodash'
import { app, config, use, api } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { getFieldProp } from './utils'
import { ModelContext } from './base'

import {
  useRecoilState,
  useRecoilValue, useSetRecoilState, useRecoilCallback
} from 'recoil'

const useModelRecoilAtom = (atom, fkey) => {
  const model = useContext(ModelContext)
  let state = atom
  if(_.isFunction(atom)) {
    state = atom(model.atoms)
  } else if(_.isString(atom)) {
    state = model.atoms[atom]
    if(_.isNil(state)) {
      throw Error(`Model atom ${atom} undefined.`)
    }
    if(fkey) {
      state = state(fkey)
    }
  }
  return state
}

const useModelValue = (atom, fkey) => {
  return useRecoilValue(useModelRecoilAtom(atom, fkey))
}
const useModelState = (atom, fkey) => {
  return useRecoilState(useModelRecoilAtom(atom, fkey))
}
const useSetModelState = (atom, fkey) => {
  return useSetRecoilState(useModelRecoilAtom(atom, fkey))
}
const useModelCallback = (cb, deps) => {
  const { model, atoms } = use('model')
  return useRecoilCallback(proxy => {
    proxy.atoms = atoms
    return cb(proxy)
  }, [ ...deps, model ])
}

export default {
  'model': () => {
    const model = useContext(ModelContext)
    const rest = useMemo(() => api(model), [ model ])
    return { model, rest, atoms: model.atoms }
  },
  'model.value': useModelValue,
  'model.setter': useSetModelState,
  'model.state': useModelState,
  'model.callback': useModelCallback,
  // Get Model Item
  'model.get': ({ id, query, item }) => {
    const { model, rest } = use('model')

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

    return { model, title, ...state }
  },
  // Save Model Item
  'model.save': (props) => {
    const { model, rest } = use('model')
    const message = use('message')
    const successMessage = props?.successMessage

    const saveItem = useModelCallback(({ set, atoms }) => async (item, partial) => {
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
    }, [ ])

    return { model, saveItem }
  },
  // Delete Model Item
  'model.delete': (props) => {
    const { model, rest } = use('model')
    const { getItems } = use('model.getItems')
    const message = use('message')
    const deleteMessage = props?.deleteMessage
    const itemId = props?.id

    const deleteItem = useModelCallback(({ snapshot, set, atoms }) => async (id) => {
      id = id || itemId
      await rest.delete(id)
      // unselect
      const selected = snapshot.getLoadable(atoms.selected).contents
      set(atoms.selected, selected.filter(i => { return i.id !== id }))
      message?.success && message.success(deleteMessage || _t('Delete {{object}} success', { object: model.title || model.name }))
      // getItems
      await getItems()
    }, [ itemId ])

    return { model, deleteItem }
  },
  // Delete Model Item
  'model.getItems': () => {
    const { model, rest } = use('model')

    const getItems = useModelCallback(({ snapshot: ss, set, reset, atoms }) => async (query) => {
      let { wheres: newWheres, ...newOption } = query || {}
      const wheres = newWheres || ss.getLoadable(atoms.wheres).contents
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
    }, [ ]);

    return { model, getItems }
  },
  // Model Item hooks
  'model.item': props => {
    return {
      ...use('model.get', props),
      ...use('model.save', props),
      ...use('model.delete', props)
    }
  },
  'model.query': () => {
    const { model, rest } = use('model')

    const [ data, setData ] = useState(null)
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
      setLoading(true)
      rest.query().then(({ items, count }) => {
        setData(items)
        setLoading(false)
      })
    }, [ ])

    return { items: data, loading, model }
  },
  'model.permission': () => {
    const { model } = use('model')
    return {
      canAdd: !!model.permission && !!model.permission.add,
      canDelete: !!model.permission && !!model.permission.delete,
      canEdit: !!model.permission && !!model.permission.edit
    }
  },
  'model.event': () => {
    const { model } = use('model')
    const nav = use('navigate')
    return {
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
    const option = useModelValue('option')
    const wheres = useModelValue('wheres')

    React.useEffect(() => {
      getItems()
    }, [ option, wheres ])

    return null
  },
  'model.pagination': () => {
    const atoms = use('model.atoms')
    const count = useModelValue('count')
    const limit = useModelValue('limit')
    const [ skip, setSkip ] = useModelState('skip')
    
    const items = Math.ceil(count / limit)
    const activePage = Math.floor(skip / limit) + 1

    const changePage = useCallback((page) => {
      const skip = limit * (page - 1)
      setSkip(skip)
    }, [ setSkip, limit ])
    
    return { items, activePage, changePage }
  },
  'model.count': () => ({ count: useModelValue('count') }),
  'model.pagesize': () => {
    const [limit, setLimit] = useModelState('limit')
    const setSkip = useSetModelState('skip')

    const sizes = config('pageSizes', [ 15, 30, 50, 100 ])

    const setPageSize = useCallback((size) => {
      setLimit(size)
      setSkip(0)
    }, [ setLimit, setSkip ] )

    return { sizes, setPageSize, size: limit }
  },
  'model.fields': () => {
    const { model } = use('model')
    const [ selectedFields, setFields ] = useModelState('fields')

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

    return { fields: model.properties, changeFieldDisplay, selected: selectedFields }

  },
  'model.list': () => {
    use('model.effect')
    
    const items = useModelValue('items')
    const selected = useModelValue('selected')
    const fields = useModelValue('fields')
    const loading = useModelValue('loading', 'items')

    return { loading, items, fields, selected }
  },
  'model.actions': () => {
    const { model } = use('model')
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

    return { actions, renderActions }
  },
  'model.select': () => {
    const { atoms } = use('model')
    const selected = useModelValue('selected')
    const [isSelectedAll, onSelectAll] = useModelState('allSelected')

    const onSelect = useModelCallback(({ set, atoms }) => (item, isSelect) => {
      set(atoms.itemSelected(item.id), isSelect)
    }, [ ])

    return { count: selected.length, selected, isSelectedAll, onSelect, onSelectAll }
  },
  'model.list.row': ({ id }) => {
    const { model } = use('model')
    const item = useModelValue('item', id)
    const [ itemSelected, changeSelect ] = useModelState('itemSelected', id)

    return { selected: itemSelected, item, changeSelect, actions: model.itemActions || [ 'edit', 'delete' ] }
  },
  'model.list.header': ({ field }) => {
    const { model } = use('model')
    const property = getFieldProp(model, field) || {}
    const title = property.header || property.title || _.startCase(field)

    return { title }
  },
  'model.list.order': ({ field }) => {
    const { model } = use('model')
    const property = getFieldProp(model, field) || {}
    const canOrder = (property.canOrder !== undefined ? property.canOrder : 
      ( property.orderField !== undefined || (property.type != 'object' && property.type != 'array')))
    const [itemOrder, changeOrder] = useModelState('itemOrder', property.orderField || field)

    return { changeOrder, canOrder, order: itemOrder }
  },
  'model.list.item': ({ schema, field, item, nest }) => {
    const { model } = use('model')
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

    return data
  }

}
