import React from 'react'
import _ from 'lodash'
import app, { use } from 'xadmin'
import { Form } from 'xadmin-form'
import { C } from 'xadmin-ui'
import { getFieldProp } from '../utils'
import filter_converter from './filters'

import { useRecoilState, useSetRecoilState } from 'recoil'

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
  const { model, atoms } = use('model')
  const [data, setFilters] = useRecoilState(atoms.where('filters'))

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

  const fields = React.useMemo(() => filters.map(filter => {
    const field = convert(filter.schema, { key: filter.key })
    return _.merge(field, filter.field, fieldProps)
  }), [ filters, fieldProps ])

  const onSubmit = React.useCallback((values) => {
    const where = Object.keys(values).reduce((prev, key) => {
      if(!_.isNil(values[key])) {
        prev[key] = values[key]
      } else {
        prev = _.omit(prev, key)
      }
      return prev
    }, { ...data })
    setFilters(where)
  }, [ model, data, setFilters ])

  const onChange = (options && options.submitOnChange == true) ? onSubmit : undefined
  
  return (fields && filters.length) ? (<Form onSubmit={onSubmit} onChange={onChange}
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
  components: {
    'Model.BaseFilter': BaseFilter
  },
  blocks: {
    'model.list.nav': filter('navform', 'Filter.NavForm', 'Form.InlineGroup'),
    'model.list.navbtn': filter('nav', 'Filter.Modal'),
    'model.list.submenu': filter('submenu', 'Filter.Submenu', 'Form.ColGroup'),
    'model.list.sidemenu': filter('sidemenu', 'Filter.Form', 'Form.SimpleGroup')
  },
  hooks: {
    'model.list.filter': () => {
      const { model, atoms } = use('model')
      const { form } = use('form')
      const setFilters = useSetRecoilState(atoms.where('filters'))

      const resetFilter = React.useCallback(() => {
        const initial = _.isFunction(model.initialValues) ? model.initialValues() : model.initialValues
        const where = initial && initial.wheres && initial.wheres.filters || {}
        form.reset(where)
        setFilters(where)
      }, [ model, setFilters ])

      React.useEffect(() => {
        if(model.filterDefault) {
          const values = _.isFunction(model.filterDefault) ? model.filterDefault() : model.filterDefault
          form.reset(values)
        }
      }, [ model.filterDefault ])

      return { resetFilter }
    }
  },
  filter_converter
}
export {
  BaseFilter
}
