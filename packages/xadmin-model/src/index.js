import React from 'react'
import { C, Icon, Menu } from 'xadmin-ui'

import { Model, ModelContext, ModelBlock, ModelRoutes } from './base'
import hooks from './hooks'
import fieldRenders from './render'

import relate from './relate'
import filter from './filter'
import actions from './actions'

import search from './search'
import modalform from './modalform'
import reldetail from './reldetail'

import * as atoms from './atoms'
import * as utils from './utils'
import _ from 'lodash'

const app = {
  name: 'xadmin.model',
  items: {
    models: { type: 'map' },
    fieldRenders: { type: 'array' },
    modelActions: { type: 'map' }
  },
  components: {
    'Model.Routes': ModelRoutes
  },
  blocks: (app) => {
    const models = app.get('models')
    return {
      'main.menu': () => {
        return Object.keys(models).map((name) => {
          const model = models[name]
          if(model.permission?.view && model.ui?.showMenu && model.ui?.menuPath) {
            return <Menu.Item itemKey={`main-menu-item-model-${name}`} onItemClick={()=>app.go(model.ui.menuPath)} icon={<Icon name={model.icon || name}/>}>{model.title}</Menu.Item>
          }
        }).filter(item => item !== undefined)
      }
    }
  },
  routers: (app) => {
    const models = app.get('models')
    const { _t } = app.context
    let routes = {
      '/app/': [
        { path: 'model' }
      ]
    }

    const autoModelRoutes = app.config('autoModelRoutes')
    let defaultRootRoute = '/app/model'
    if(autoModelRoutes === false) {
      return routes
    } else if(_.isString(autoModelRoutes)) {
      defaultRootRoute = autoModelRoutes
    }

    for (let name in models) {
      const model = models[name]
      const modelName = model.title || model.name
      const rs = _.isArray(model.route) ? model.route : [ (model.route || { parentPath: defaultRootRoute, path: name }) ]

      rs.forEach(r => {
        const parent = r.parentPath || '/'
        const path = _.isString(r) ? r : r.path
        if(!routes[parent]) {
          routes[parent] = []
        }
        routes[parent].push({
          path: `${path}/*`,
          breadcrumbName: _t('{{name}} List', { name: modelName }),
          element: <Model key={`model.${parent}.${path}`} name={name}><ModelRoutes /></Model>
        })

      })
    }
    
    return routes
  },
  hooks,
  fieldRenders,
  modelActions: {
    edit: {
      default: true, component: C.lazy('Model.ActionEdit')
    },
    delete: {
      default: true, component: C.lazy('Model.ActionDelete')
    }
  }
}

const apps = {
  relate, filter, actions, search, modalform, reldetail
}

export { Model, ModelBlock, ModelContext, ModelRoutes, atoms, apps, utils,  }
export default app
