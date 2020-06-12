import React from 'react'
import _ from 'lodash'
import app, { use } from 'xadmin'
import { Form } from 'xadmin-form'
import { C } from 'xadmin-ui'
import { getFieldProp } from '../utils'
import filter_converter from './filters'

const convert = (schema, options) => {
  const opts = options || {}
  return app.load_list('filter_converter').reduce((prve, converter) => {
    return converter(prve, schema, opts)
  }, {})
}

const FilterForm = (props) => {
  const { component: FilterComponent, ...filterForm } = props
  const { resetFilter } = use('model.list.filter')
  return <FilterComponent {...filterForm} resetFilter={resetFilter} />
}

const BaseFilter = props => {
  const { name, component, group, fieldProps } = props
  const { dispatch } = use('redux')
  const { data, model, getModelState } = use('model', state => ({ data: state.wheres.filters }))

  const { filters, options, formKey } = React.useMemo(() => {
    const formKey = `filter.${model.key || model.name}`
    const filter = model.filters && model.filters[name]
    let fields, options

    if(_.isArray(filter)) {
      options = {}
      fields = filter
    } else if(_.isPlainObject(filter) && _.isArray(filter.fields)) {
      fields = filter.fields
      options = _.omit(filter, 'fields')
    } else {
      return {
        filters: [], formKey, options: {}
      }
    }

    const filters = fields.map(field => {
      const key = typeof field == 'string' ? field : field.key
      const schema = getFieldProp(model, key)
      return schema ? {
        key, schema,
        field: typeof field == 'string' ? { } : field
      } : null
    }).filter(Boolean)

    return { filters, formKey, options }

  }, [ model, name ])

  if(!filters || !filters.length) {
    return null
  }

  const fields = React.useMemo(() => filters.map(filter => {
    const field = convert(filter.schema, { key: filter.key })
    return _.merge(field, filter.field, fieldProps)
  }), [ filters, fieldProps ])


  const onSubmit = React.useCallback((values) => {
    const modelState = getModelState()
    const where = Object.keys(values).reduce((prev, key) => {
      if(!_.isNil(values[key])) {
        prev[key] = values[key]
      } else {
        prev = _.omit(prev, key)
      }
      return prev
    }, { ...modelState.wheres.filters })
    const wheres = (Object.keys(where).length > 0 ? 
      { ...modelState.wheres, filters: where } : _.omit(modelState.wheres, 'filters'))
      
    dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter, skip: 0 }, wheres })
  }, [ model ])

  const onChange = (options && options.submitOnChange == true) ? onSubmit : undefined
  
  return fields ? (<Form onSubmit={onSubmit} onChange={onChange}
    fields={fields}
    component={props => <FilterForm {...props} component={component}/>}
    group={group}
    initialValues={data||{}}
    options={options}
  />) : null

}

const filter = (name, componentName, groupName) => ({ model }) => (
  (model && model.filters && model.filters[name]) ? <BaseFilter name={name} component={C(componentName)} group={groupName && C(groupName)} /> : null
)

export default {
  name: 'xadmin.filter',
  blocks: {
    'model.list.nav': filter('navform', 'Filter.NavForm', 'Form.InlineGroup'),
    'model.list.navbtn': filter('nav', 'Filter.Modal'),
    'model.list.submenu': filter('submenu', 'Filter.Submenu', 'Form.ColGroup'),
    'model.list.sidemenu': filter('sidemenu', 'Filter.Form', 'Form.SimpleGroup')
  },
  hooks: {
    'model.list.filter': props => {
      const { dispatch } = use('redux')
      const { model, getModelState } = use('model')
      const { form } = use('form')

      const resetFilter = React.useCallback(() => {
        const initial = _.isFunction(model.initialValues) ? model.initialValues() : model.initialValues
        const where = initial && initial.wheres && initial.wheres.filters || {}
        form.reset(where)

        const modelState = getModelState()
        const wheres = (Object.keys(where).length > 0 ? 
          { ...modelState.wheres, filters: where } : _.omit(modelState.wheres, 'filters'))

        dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter, skip: 0 }, wheres })
      }, [ model ])

      React.useEffect(() => {
        if(model.filterDefault) {
          const values = _.isFunction(model.filterDefault) ? model.filterDefault() : model.filterDefault
          form.reset(values)
        }
      }, [ model.filterDefault ])

      return { ...props, resetFilter }
    }
  },
  filter_converter
}
export {
  BaseFilter
}
