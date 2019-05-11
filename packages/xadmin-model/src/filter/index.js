import React from 'react'
import _ from 'lodash'
import app, { use } from 'xadmin'
import { BaseForm, reduxForm } from 'xadmin-form'
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
  const { formKey, filters, fieldProps, onSubmit, options } = props

  const { WrapForm, fields } = React.useMemo(() => {
    const fields = filters.map(filter => {
      const field = convert(filter.schema, { key: filter.key })
      return _.merge(field, filter.field, fieldProps)
    })
    const WrapForm = reduxForm({ 
      form: formKey,
      destroyOnUnmount: false,
      enableReinitialize: true,
      onChange: (options && options.submitOnChange == true) ? onSubmit : undefined,
      ...(options && options.formProps)
    })(BaseForm)

    return { WrapForm, fields }
  }, [ formKey, filters, fieldProps, options ])

  return WrapForm && fields ? <WrapForm fields={fields} {...props}/> : null
}

const BaseFilter = props => {
  const { filters, options, component, group, formKey, data, changeFilter, resetFilter } = use('model.list.filter', props)

  if(!filters || !filters.length) {
    return null
  }

  return (<FilterForm
    formKey={formKey}
    filters={filters}
    component={component}
    group={group}
    initialValues={data}
    onSubmit={changeFilter}
    options={options}
    resetFilter={resetFilter}
  />)

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
      const { store, dispatch } = use('redux')
      const { data, model, modelState } = use('model', state => ({ data: state.wheres.filters }))
      const { name } = props

      const { filters, options, formKey } = React.useMemo(() => {
        const formKey = `filter.${model.name}`
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

      const resetFilter = React.useCallback(() => {
        const formKey = `filter.${model.name}`
        const initial = _.isFunction(model.initialValues) ? model.initialValues() : model.initialValues
        const where = initial && initial.wheres && initial.wheres.filters || {}
        let values = _.get(store.getState(),`form.${formKey}.values`) || {}
        values = { ...values, ...where }
        const cf = []
        Object.keys(values).forEach(field => {
          if(where[field] !== undefined) {
            dispatch({
              type: '@@redux-form/CHANGE',
              meta: {
                form: formKey, field: field
              },
              payload: where[field]
            })
          } else {
            cf.push(field)
          }
        })
        if(cf.length > 0) {
          dispatch({
            type: '@@redux-form/CLEAR_FIELDS',
            meta: {
              form: formKey,
              fields: cf
            }
          })
        }

        const wheres = (Object.keys(where).length > 0 ? 
          { ...modelState.wheres, filters: where } : _.omit(modelState.wheres, 'filters'))

        dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter, skip: 0 }, wheres })
      }, [ store, model, name, modelState.wheres, modelState.filter ])

      const changeFilter = React.useCallback(() => {
        const values = _.get(store.getState(),`form.filter.${model.name}.values`) || {}
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
      }, [ store, model, name, modelState.wheres ])

      React.useEffect(() => {
        if(model.filterDefault) {
          const form = `filter.${model.name}`
          const values = _.isFunction(model.filterDefault) ? model.filterDefault() : model.filterDefault
          dispatch({
            type: '@@redux-form/INITIALIZE',
            meta: { form: form },
            payload: values
          })
        }
      }, [ model.filterDefault ])

      return { ...props,
        filters, options, formKey, data: _.clone(data),
        resetFilter, changeFilter
      }
    }
  },
  filter_converter
}
export {
  BaseFilter
}
