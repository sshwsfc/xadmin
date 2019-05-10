import React from 'react'
import _ from 'lodash'
import app, { api, use } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { Loading, C, Check, Input } from 'xadmin-ui'
import { Model } from './base'

const Checkboxes = props => {
  const { input: { value, onChange }, field, loading, options } = use('model.relate.select', props)

  const onCheckChange = React.useCallback((checked, option) => {
    if(checked) {
      onChange([ ...value, option ])
    } else {
      onChange(value.filter(item => item.id != option.id))
    }
  }, [ value, onChange ])

  const renderOptions = () => {
    const checkedIds = value ? value.map(item => item.id) : []

    return options.map(({ value, label, item })=>{
      const checked = checkedIds.indexOf(value) >= 0
      return <Check onChange={()=>{onCheckChange(!checked, item)}} checked={checked} {...field.attrs} >{label}</Check>
    })
  }

  return loading ? <Loading /> : 
    (options ? renderOptions() : <Input.Static>{_t('Empty')}</Input.Static>)
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

const RelateContainer = props => {
  const { data, loading, model, children } = use('model.get', props)
  return loading || data == undefined ? <Loading /> : 
    <C is="Relate.Container" model={model} data={data} >
      <RelateContext.Provider value={{ item: data, model }}>{children}</RelateContext.Provider>
    </C>
}

const RelateWrap = (SubComponent, pname) => ({ location, ...props }) => {
  const { item, model } = React.useContext(RelateContext)
  return <SubComponent {...props} location={{ ...location, query: {  ...location.query, [pname || model.name]: item.id } }} />
}

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

const RelateAction = props => {
  const { model, item } = use('model', props)
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

export default {
  name: 'xadmin.model.relate',
  schema_converter,
  filter_converter,
  routers,
  hooks: {
    'model.relate.select': props => {
      const { model, field } = use('model', props)
      const [ loading, setLoadig ] = React.useState(false)
      const [ items, setItems ] = React.useState([])
      
      const loadOptions = React.useCallback(inputValue => {
        const displayField = field.displayField || 'name'
        setLoadig(true)
        return api(field.schema)
          .query({ limit: 1000, fields: [ 'id', displayField ] }, 
            inputValue ? { search: { [displayField]: { like: inputValue } } } : {})
          .then(({ items }) => {
            setLoadig(false)
            setItems(items.map(item => 
              ({ value: item.id, label: item[displayField], item })
            ))
          }
          )
      }, [ model, field ])

      React.useEffect(() => {
        loadOptions()
      }, [])

      return { ...props, loadOptions, loading, items }
    }
  }
}
export {
  Checkboxes,
  RelateAction
}
