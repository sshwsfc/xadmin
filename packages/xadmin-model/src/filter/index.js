import React from 'react'
import _ from 'lodash'
import app from 'xadmin'
import { BaseForm, reduxForm } from 'xadmin-form'
import { C } from 'xadmin-ui'
import { ModelWrap } from '../index'
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
  return <WrapForm fields={fields} {...props}/>
}

@ModelWrap('model.list.filter')
class BaseFilter extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.state != nextState
  }

  renderFilterForm() {
    const { filters, options, component, group, formKey, data, changeFilter, resetFilter } = this.props

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

  render() {
    const { filters } = this.props
    if(filters && filters.length) {
      return this.renderFilterForm()
    } else {
      return null
    }
  }

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
  mappers: {
    'model.list.filter': {
      data: ({ model, modelState }, { name }) => {
        return {
          data: modelState.wheres.filters
        }
      },
      compute: ({ model, modelState }, { data, name }) => {
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
            filters: [], formKey: `filter.${model.name}`
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

        return {
          filters, data: _.clone(data), options,
          formKey: `filter.${model.name}`
        }
      },
      method: {
        resetFilter: ({ dispatch, model, state, modelState }) => (e) => {
          const formKey = `filter.${model.name}`
          const initial = _.isFunction(model.initialValues) ? model.initialValues() : model.initialValues
          const where = initial && initial.wheres && initial.wheres.filters || {}
          const values = { ...state.form[formKey], ...where }
          const cf = []
          Object.keys(values).forEach(field => {
            if(where[field] !== undefined) {
              // dispatch(change(formKey, field, where[field]))
            } else {
              cf.push(field)
            }
          })
          if(cf.length > 0) {
            // dispatch(clearFields(formKey, false, false, ...cf))
          }

          const wheres = (Object.keys(where).length > 0 ? 
            { ...modelState.wheres, filters: where } : _.omit(modelState.wheres, 'filters'))

          dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter, skip: 0 }, wheres })
        },
        changeFilter: ({ dispatch, model, state, modelState }, { name }) => () => {
          const values = state.form && state.form[`filter.${model.name}`] || {}
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
        }
      }
      // event: {
      //   mount: ({ dispatch, model }) => {
      //     if(model.filterDefault) {
      //       const values = _.isFunction(model.filterDefault) ? model.filterDefault() : model.filterDefault
      //       dispatch(initialize(`filter.${model.name}`, values))
      //     }
      //   }
      // }
    }
  },
  filter_converter
}
export {
  BaseFilter
}
