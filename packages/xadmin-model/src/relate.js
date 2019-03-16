import React from 'react'
import _ from 'lodash'
import { Checkbox, Form, DropdownButton, Dropdown } from 'react-bootstrap'

import app, { api } from 'xadmin'
import { Loading } from 'xadmin-layout'
import Icon from 'react-fontawesome'

import ModelPages from './components/Pages'
import { Model, ModelWrap } from './base'

import AsyncSelect from 'react-select/lib/Async'

class RelateBase extends React.Component {

  loadOptions = inputValue => {
    const { input: { value }, label, meta, field, group: FieldGroup } = this.props
    const displayField = field.displayField || 'name'
    return api(field.schema)
      .query({ limit: 1000, fields: [ 'id', displayField ] }, 
        inputValue ? { search: { [displayField]: { like: inputValue } } } : {})
      .then(({ items }) => 
        items.map(item => 
          ({ value: item.id, label: item[displayField], item })
        )
      )
  }
}

class Checkboxes extends RelateBase {

  state = { loading: false, options: [] }

  componentDidMount() {
    this.setState({ loading: true })
    this.loadOptions().then(options => {
      this.setState({ loading: false, options })
    })
  }

  onChange(checked, option) {
    const { input: { value, onChange } } = this.props
    if(checked) {
      onChange([ ...value, option ])
    } else {
      onChange(value.filter(item => item.id != option.id))
    }
  }

  renderOptions() {
    const { input, field } = this.props
    const { options } = this.state
    const checkedIds = input.value ? input.value.map(item => item.id) : []

    return options.map(({ value, label, item })=>{
      const checked = checkedIds.indexOf(value) >= 0
      return <Checkbox onChange={()=>{this.onChange(!checked, item)}} checked={checked} {...field.attrs} >{label}</Checkbox>
    })
  }

  render() {
    const { _t } = app.context
    const { input, label, meta, field, group: FieldGroup } = this.props
    const { loading, options } = this.state
    return (
      <FieldGroup label={label} meta={meta} input={input} field={field}>
        {loading ? <Form.Control plaintext readOnly defaultValue={_t('loading')} /> : 
          (options ? this.renderOptions() : <Form.Control plaintext readOnly defaultValue={_t('Empty')} />)
        }
      </FieldGroup>
    )
  }

}

//@FormWrap('model.form.fkselect')
class RelateSelect extends RelateBase {

  onChange = (option) => {
    this.props.input.onChange(option.item)
  }

  render() {
    const { _t } = app.context
    const { input: { value: item }, label, meta, field, group: FieldGroup } = this.props
    const displayField = field.displayField || 'name'
    return (
      <FieldGroup label={label} meta={meta} input={this.props.input} field={field}>
        <AsyncSelect cacheOptions defaultOptions 
          selectOption={item ? { item, label: item[displayField], value: item.id } : null} 
          onChange={this.onChange}
          loadOptions={this.loadOptions} 
        />
      </FieldGroup>
    )
  }
}

class RelateMultiSelect extends RelateBase {

  onChange = (options) => {
    this.props.input.onChange(options.map(opt => opt.item))
  }

  render() {
    const { _t } = app.context
    const { input: { value: items }, label, meta, field, group: FieldGroup } = this.props
    const displayField = field.displayField || 'name'
    return (
      <FieldGroup label={label} meta={meta} input={this.props.input} field={field}>
        <AsyncSelect cacheOptions defaultOptions isMulti closeMenuOnSelect={false}
          selectOption={items ? items.map(item => ({ value: item.id, item, label: item[displayField] })) : null} 
          onChange={this.onChange} 
          loadOptions={this.loadOptions} 
        />
      </FieldGroup>
    )
  }

}

class FilterRelateSelect extends RelateBase {

  onChange = (option) => {
    this.props.input.onChange(option.value)
  }

  render() {
    const { _t } = app.context
    const { input: { value: selectId }, label, meta, field, group: FieldGroup } = this.props

    return (
      <FieldGroup label={label} meta={meta} input={this.props.input} field={field}>
        <AsyncSelect cacheOptions defaultOptions 
          isOptionSelected={option => selectId && option.value == selectId}
          onChange={this.onChange} 
          loadOptions={this.loadOptions} 
        />
      </FieldGroup>
    )
  }
}

const schema_converter = [
  (f, schema, options) => {
    if(schema.type == 'array' && schema.items.type == 'object' && schema.items.relateTo) {
      const models = app.get('models')
      const name = schema.items.relateTo
      if(models[name]) {
        const model = models[name]
        f.type = 'multi_select'
        f.schema = model
        f.displayField = model.display_field || 'name'
      }
    }
    return f
  },
  (f, schema, options) => {
    if(schema.type == 'object' && schema.relateTo) {
      const models = app.get('models')
      const relateName = schema.relateTo
      if(models[relateName]) {
        const model = models[relateName]
        f.type = 'fkselect'
        f.schema = model
        f.displayField = model.display_field || 'name'
      }
    }
    return f
  }
]

const filter_converter = [
  (f, schema, options) => {
    if(schema.type == 'object' && schema.relateTo) {
      const models = app.get('models')
      const relateName = schema.relateTo
      if(models[relateName]) {
        const model = models[relateName]
        f.type = 'filter_relate'
        f.schema = model
        f.displayField = model.display_field || 'name'
      }
    }
    return f
  } 
]

const form_fields = {
  fkselect: {
    component: RelateSelect
  },
  multi_select: {
    component: RelateMultiSelect
  },
  filter_relate: {
    component: FilterRelateSelect,
    parse: (value, name) => {
      if(value && value.id) {
        return value.id
      }
      return value
    }
  }
}

const RelateContext = React.createContext()

@ModelWrap('model.item')
class RelateContainer extends React.Component {

  render() {
    const { data, loading, model } = this.props
    const displayField = model.display_field || 'name'
    return loading || data == undefined ? <Loading /> : 
      <>
        <h4><Icon name={model.icon} /> {data[displayField]}</h4>
        <hr/>
        <RelateContext.Provider value={{ item: data, model }}>{this.props.children}</RelateContext.Provider>
      </>
  }

}

const RelateWrap = (SubComponent, pname) => ({ location, ...props }) => (
  <RelateContext.Consumer>
    {({ item, model }) => <SubComponent {...props} location={{ ...location, query: {  ...location.query, [pname || model.name]: item.id } }} /> }
  </RelateContext.Consumer>
)

const routers = (app) => {
  const models = app.get('models')
  const { _t } = app.context
  const names = Object.keys(models)
  const routes = {}

  for(let name of names) {
    const model = models[name]
    const modelName = model.title || model.name

    // 每个model都加上relations页面
    routes[`/app/model/${name}/`] = {
      path: ':id/relations/',
      breadcrumbName: _t('{{name}} List', { name: modelName }),
      component: ({ params: { id }, children }) => {
        return <RelateContainer id={id}>{children}</RelateContainer>
      }
    }

    // 循环判断每个Model的properties中的object对象
    for(let pname of Object.keys(model.properties || {})) {
      const prop = model.properties[pname]
      if(prop.type == 'object' && prop.relateTo && names.indexOf(prop.relateTo) > -1) {
        // 找到relate对象
        const relateName = prop.relateTo
        const relateModel = models[relateName]
        const model_routes = []

        if(!model.permission || model.permission.view) {
          model_routes.push({
            path: 'list',
            breadcrumbName: _t('{{name}} List', { name: modelName }),
            component: RelateWrap(ModelPages.ModelListPage, pname)
          })
        }
        if(model.permission && model.permission.add) {
          model_routes.push({
            path: 'add',
            breadcrumbName: _t('Create {{name}}', { name: modelName }),
            component: RelateWrap(ModelPages.ModelFormPage, pname)
          })
        }
        const key = `/app/model/${relateName}/:id/relations/`
        routes[key] = [ ...(routes[key] || []), {
          path: `${name}/`,
          breadcrumbName: _t('{{name}} List', { name: modelName }),
          component: ({ children }) => <Model name={name} modelKey={`${relateName}_${name}`}>{children}</Model>,
          indexRoute: {
            onEnter: ({ location }, replace) => replace({ pathname: location.pathname + 'list' })
          },
          childRoutes: model_routes
        } ]
      }
    }
  }
  return routes
}

@ModelWrap('model.relate.action')
class RelateAction extends React.Component {

  render() {
    const { model, item, variant } = this.props
    const { _t } = app.context
    const actions = []

    const models = app.get('models')
    Object.keys(models).forEach(key => {
      const m = models[key]
      for(let pname of Object.keys(m.properties || {})) {
        const prop = m.properties[pname]
        if(prop.type == 'object' && (prop.relateTo == model.key || prop.relateTo == model.name)) {
          actions.push(m)
          continue
        }
      }
    })

    return actions.length ? (
      <DropdownButton
        title={_t('Relates')}
        variant={ variant || 'primary' }
        key="dropdown-action-relate"
        size="sm"
        className="model-list-action"
      >
        { actions.map((m, index) => 
          (<Dropdown.Item eventKey={index} key={index} 
            onSelect={()=>app.go(`/app/model/${model.name}/${item.id}/relations/${m.name}/`)}>{m.title || m.name}</Dropdown.Item>)
        )}
      </DropdownButton>
    ) : null
  }
}

export default {
  name: 'xadmin.model.relate',
  form_fields,
  schema_converter,
  filter_converter,
  routers
}
export {
  Checkboxes,
  RelateAction
}
