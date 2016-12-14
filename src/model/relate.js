import React from 'react'
import { PropTypes, createElement } from 'react'
import _ from 'lodash'
import { FieldArray } from 'redux-form'
import { fork, put, call, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga'
import { FieldGroup } from '../form/components/base'
import { Checkbox, FormControl } from 'react-bootstrap'
import { Icon } from '../components'
import List from './components/List'
import Form from './components/Form'
import { FormWrap } from '../form'
import { Model, ModelWrap } from './base'
import api from '../api'
import { Block, StoreWrap, app } from '../index'
import { SimpleSelect, MultiSelect } from 'react-selectize'
import 'react-selectize/themes/index.css'

const Checkboxes = FormWrap('model.form.relates')(React.createClass({

  componentDidMount() {
    const { input, options, field } = this.props
    if(!options) {
      this.props.getRelatedItems()
    }
  },

  onChange(checked, option) {
    const { input: { value, onChange } } = this.props
    if(checked) {
      onChange([ ...value, option ])
    } else {
      onChange(value.filter(item => item.id != option.id))
    }
  },

  renderOptions() {
    const { input, options, field } = this.props
    const displayField = field.displayField || 'name'
    const checkedIds = input.value ? input.value.map(item => item.id) : []
    return options.map(option=>{
      const checked = checkedIds.indexOf(option.id) >= 0
      return <Checkbox onChange={()=>{this.onChange(!checked, option)}} checked={checked} {...field.attrs} >{option[displayField]}</Checkbox>
    })
  },

  render() {
    const { input, options, label, meta: { touched, error }, field } = this.props
    const { items } = field
    return (
      <FieldGroup
        id={items.name}
        label={label}
        error={touched && error}
        help={field.description || field.help}
        control={{ ...field.attrs }}
        >
        {options?this.renderOptions():<div>loading...</div>}
      </FieldGroup>
      )
  }

}))

const RelateMultiSelect = FormWrap('model.form.relates')(React.createClass({

  componentDidMount() {
    const { input, options, field } = this.props
    if(options == null) {
      this.props.getRelatedItems()
    }
  },

  onChange(checked, option) {
    const { input: { value, onChange } } = this.props
    if(checked) {
      onChange([ ...value, option ])
    } else {
      onChange(value.filter(item => item.id != option.id))
    }
  },

  onValuesChange(selectOptions) {
    const { input: { value, onChange }, options } = this.props
    onChange(selectOptions.map(option=>{ return option.item }))
  },

  renderOptions() {
    const { input, options, field } = this.props
    const displayField = field.displayField || 'name'
    const checkedValues = input.value ? input.value.map(item => { return { label: item[displayField] || 'null', value: item.id, item }}) : []
    return (<MultiSelect theme="bootstrap3" ref = "select"
        placeholder={`Select ${field.label}`}
        values={checkedValues}
        options={options.map(option=>{ return { label: option[displayField] || 'null', value: option.id, item: option } })}
        onValuesChange={this.onValuesChange}
        renderNoResultsFound={()=>{ return (<div className="no-results-found">No results found</div>)}}
      />)
  },

  render() {
    const { input, options, label, meta: { touched, error }, field } = this.props
    const { items } = field
    return (
      <FieldGroup
        id={items.name}
        label={label}
        error={touched && error}
        help={field.description || field.help}
        control={{ ...field.attrs }}
        >
        {options?this.renderOptions():<FormControl.Static>loading...</FormControl.Static>}
      </FieldGroup>
      )
  }

}))

const RelateSelect = FormWrap('model.form.fkselect')(React.createClass({

  getInitialState() {
    return { search: '' }
  },

  onValueChange(select) {
    const { input: { value, onChange }, options } = this.props
    this.setState({ search: '' })
    onChange(select ? select.item : {})
  },

  onSearchChange(search) {
    this.setState({ search })
    if(search && search != '') {
      this.props.searchRelatedItems(search)
    }
  },

  componentDidMount() {
    const { input: { value, onChange }, options, getValue, field } = this.props
    if(options && options.length > 0) {
      this.refs.select.highlightFirstSelectableOption()
    }
    if(value && typeof value == 'string') {
      getValue(value)
      const displayField = field.displayField || 'name'
      setTimeout(()=>{
        onChange({ [displayField]: 'loading...', id: value })
      }, 10)
    }
    if(field.lazyLoad == false) {
      this.props.searchRelatedItems()
    }
  },

  componentWillReceiveProps(nextProps) {
    const { field } = this.props
    if(field.limit && nextProps.values != this.props.values) {
      this.props.searchRelatedItems()
    }
  },

  renderOptions() {
    const { input: { value }, options, field } = this.props
    const displayField = field.displayField || 'name'
    const selectValue = value ? { label: value[displayField] || 'null', value: value.id } : null
    const searchProps = field.lazyLoad == false ? {
      placeholder: `Select ${field.label}`
    } : {
      placeholder: `Search ${field.label}`,
      search: this.state.search,
      onSearchChange: this.onSearchChange
    }
    return (<SimpleSelect theme="bootstrap3" ref="select"
        placeholder={`Search ${field.label}`}
        value={selectValue}
        options={(options||[]).map(option=>{ return { label: option[displayField] || 'null', value: option.id, item: option } })}
        onValueChange={this.onValueChange}
        renderNoResultsFound={(value, search)=>{ 
          return (<div className="no-results-found" style={{ fontSize: 13 }}>
            {(search.length == 0 && field.lazyLoad != false) ? 'type a few characters to kick off remote search':'No results found'}
            </div>)
        }}
        {...searchProps}
      />)
  },

  render() {
    const { input: { value }, options, label, meta: { touched, error }, field } = this.props
    const loading = (value && typeof value == 'string')
    return (
      <FieldGroup
        id={field.name}
        label={label}
        error={touched && error}
        help={field.description || field.help}
        control={{ ...field.attrs }}
        >
        {!loading?this.renderOptions():<FormControl.Static>loading...</FormControl.Static>}
      </FieldGroup>
      )
  }

}))

const schema_converter = [
  (f, schema, options) => {
    if(schema.type == 'array' && schema.items.type == 'object') {
      f.type = 'relates'
    }
    return f
  },
  (f, schema, options) => {
    if(schema.type == 'object' && (schema.resource_name || schema.name)) {
      const models = app.load_dict('models')
      const name = schema.resource_name || schema.name
      if(models[name]) {
        f.type = 'fkselect'
      }
    }
    return f
  }
]

const form_fields = {
  relates: {
    component: RelateMultiSelect
  },
  fkselect: {
    component: RelateSelect
  }
}

const mappers = {
  'model.form.relates': {
    data: ({ state, form, formState }, { input: { value }, field }) => {
      const data = {}
      if(formState) {
        data['options'] = formState.relates ? _.get(formState.relates, field.name) : null
      }
      return data
    },
    method: {
      getRelatedItems: ({ dispatch, form }, { field }) => () => {
        const key = `form.${form.formKey}.${field.name}.relates`
        dispatch({ type: 'GET_RELATED_ITEMS', key, meta: { form: form.formKey, field, model: field.items.schema } })
      }
    }
  },
  'model.form.fkselect': {
    data: ({ state, form, formState, dispatch }, { input: { value }, field }) => {
      return {
        options: (formState && formState.relates) ? _.get(formState.relates, field.name) : [],
        values: formState && formState.values
      }
    },
    method: {
      getValue: ({ state, form, formState, dispatch }, { field }) => (value) => {
        dispatch({ 
          type: 'GET_RELATED_ITEM', 
          meta: { form: form.formKey, field, model: field.schema }, 
          id: value 
        })
      },
      searchRelatedItems: ({ dispatch, form, formState }, { field }) => (search) => {
        const displayField = field.displayField || 'name'
        const wheres = search ? { search: { [displayField]: { like: search } } } : {}

        if(field.limit) {
          const limit = field.limit(formState.values)
          if(limit == null) {
            dispatch({
              type: 'GET_RELATED_ITEMS',
              meta: { form: form.formKey, field, model: field.schema },
              success: true, items: []
            })
            return 
          } else {
            wheres['limit'] = limit
          }
        }

        dispatch({ 
          type: 'GET_RELATED_ITEMS', 
          meta: { form: form.formKey, field, model: field.schema },
          wheres: { ...wheres }
        })
      }
    }
  }
}

const reducers = {
  form: (state={}, action) => {
    if(action.type == 'GET_RELATED_ITEMS' && action.success) {
      const { meta: { form, field, model }, items } = action
      return { ..._.set(state, `${form}.relates.${field.name}`, items) }
    }
    if(action.type == 'GET_RELATED_ITEM' && action.success) {
      const { meta: { form, field, model }, item } = action
      return { ..._.set(state, `${form}.values.${field.name}`, item) }
    }
    return state
  }
}

function *handle_get_relates(action) {
  const { key, meta: { form, field, model } } = action
  try {
    yield put({ type: 'START_LOADING', key })
    const { items } = yield api(model).query(action.filter, action.wheres)
    yield put({ ...action, items, success: true })
  } catch(err) {
    yield put({ ...action, items: [], success: true })
  } finally {
    yield put({ type: 'END_LOADING', key })
  }
}

function *handle_get_relate(action) {
  const { key, meta: { form, field, model }, id } = action
  try {
    yield put({ type: 'START_LOADING', key })
    const item = yield api(model).get(id)
    yield put({ ...action, item, success: true })
  } catch(err) {
    yield put({ ...action, item: null, success: true })
  } finally {
    yield put({ type: 'END_LOADING', key })
  }
}

function *effects() {
  yield [
    takeEvery(action => action.type == 'GET_RELATED_ITEMS' && action.items == undefined, handle_get_relates),
    takeEvery(action => action.type == 'GET_RELATED_ITEM' && action.item == undefined, handle_get_relate)
  ]
}

const RelateObject = ModelWrap('model.form')(React.createClass({

  propTypes: {
    id: PropTypes.string,
    params: PropTypes.object.isRequired,
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    schema: PropTypes.object.isRequired,
    getItem: PropTypes.func.isRequired
  },

  contextTypes: {
    model: PropTypes.object.isRequired
  },

  childContextTypes: {
    relateObj: PropTypes.object.isRequired,
    relateModel: PropTypes.object.isRequired
  },

  getChildContext() {
    return { relateObj: this.props.data, relateModel: this.context.model }
  },

  componentDidMount() {
    const { data, getItem, params } = this.props
    if(data == undefined) {
      getItem(params.id)
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.props.getItem(nextProps.id)
    }
  },

  render() {
    const { data, loading, schema } = this.props
    const displayField = schema.displayField || 'name'
    return loading || data == undefined ? 
      (<div className="text-center"><Icon name="spinner fa-spin fa-4x"/> Loading..</div>) : 
      (
        <div>
          <h4><Icon name={schema.icon} /> {data[displayField]}</h4>
          <hr/>
          {this.props.children}
        </div>
      )
  }

}))

const RelateWrap = (SubComponent) => {
  return React.createClass({

    contextTypes: {
      relateObj: PropTypes.object.isRequired,
      relateModel: PropTypes.object.isRequired
    },

    render() {
      const { location, ...props } = this.props
      const { relateObj, relateModel } = this.context

      return <SubComponent {...props} location={{ ...location, query: {  ...location.query, [relateModel.name]: relateObj.id } }} />
    }
  })
}

const routers = (app) => {
  const models = app.load_dict('models')
  const names = Object.keys(models)
  const routes = {}

  for(let name of names) {
    const model = models[name]
    // 每个model都加上relations页面
    routes[`/model/${name}/`] = {
      path: ':id/relations/',
      component: RelateObject
    }

    // 循环判断每个Model的properties中的object对象
    for(let pname of Object.keys(model.properties)) {
      const prop = model.properties[pname]
      if(prop.type == 'object' && names.indexOf(prop.name) > -1) {
        // 找到relate对象
        const relateName = prop.name
        const relateModel = models[relateName]
        const model_routes = []

        if(!model.permission || model.permission.view) {
          model_routes.push({
            path: 'list',
            component: RelateWrap(List)
          })
        }
        if(model.permission && model.permission.add) {
          model_routes.push({
            path: 'add',
            component: RelateWrap(Form)
          })
        }
        const key = `/model/${relateName}/:id/relations/`
        routes[key] = [ ...(routes[key] || []), {
          path: `${name}/`,
          component: Model(name),
          childRoutes: model_routes
        } ]
      }
    }
  }
  return routes
}

export default {
  effects: (app) => effects,
  mappers,
  reducers,
  form_fields,
  schema_converter,
  routers
}
