import React from 'react'
import _ from 'lodash'
import app, { api } from 'xadmin'
import { Loading, C, Check, Input } from 'xadmin-ui'
import { Model, ModelWrap } from './base'

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
      return <Check onChange={()=>{this.onChange(!checked, item)}} checked={checked} {...field.attrs} >{label}</Check>
    })
  }

  render() {
    const { _t } = app.context
    const { input, label, meta, field, group: FieldGroup } = this.props
    const { loading, options } = this.state
    return (
      <FieldGroup label={label} meta={meta} input={input} field={field}>
        {loading ? <Loading /> : 
          (options ? this.renderOptions() : <Input.Static>{_t('Empty')}</Input.Static>)
        }
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
        f.displayField = model.displayField || 'name'
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
        f.displayField = model.displayField || 'name'
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
        f.displayField = model.displayField || 'name'
      }
    }
    return f
  } 
]

const RelateContext = React.createContext()

@ModelWrap('model.item')
class RelateContainer extends React.Component {

  render() {
    const { data, loading, model } = this.props
    return loading || data == undefined ? <Loading /> : 
      <C is="Relate.Container" model={model} data={data} >
        <RelateContext.Provider value={{ item: data, model }}>{this.props.children}</RelateContext.Provider>
      </C>
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
            component: RelateWrap(model.components && 
              (model.components['RelateListPage'] || model.components['ListPage']) || 
              (C('Relate.ListPage') || C('Model.ListPage')), pname)
          })
        }
        if(model.permission && model.permission.add) {
          model_routes.push({
            path: 'add',
            breadcrumbName: _t('Create {{name}}', { name: modelName }),
            component: RelateWrap(model.components && 
              (model.components['RelateFormPage'] || model.components['FormPage']) || 
              (C('Relate.FormPage') || C('Model.FormPage')), pname)
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
    return actions.length ? <C is="Relate.Action" model={model} actions={actions} item={item} /> : null
  }
}

export default {
  name: 'xadmin.model.relate',
  schema_converter,
  filter_converter,
  routers
}
export {
  Checkboxes,
  RelateAction,
  RelateBase
}
