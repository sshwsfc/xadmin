import _ from 'lodash'
import app from 'xadmin-core'
import _fetch from 'isomorphic-fetch'

const fetch = (url, options = {}) => {
  let status, statusText, headers = {}, body, json

  return _fetch(url, options)
    .then(response => {
      for (let pair of response.headers.entries()) {
        headers[pair[0]] = pair[1]
      }
      status = response.status
      statusText = response.statusText
      return response
    })
    .then(response => response.text())
    .then(text => {
      body = text
      try {
        json = JSON.parse(text)
      } catch (e) {
        // not json, no big deal
      }
      if (status == 401 || status == 403) {
        const { store } = app.context
        const user = store.getState().user
        const code = json.error ? json.error.code : null
        if(json.error && json.error.message == 'accessToken is required to logout') {
          // accessToken 错误但是需要退出的情况
          store.dispatch({ type: '@@xadmin/AUTH_SIGN_OUT_FINISH' })
        } else if(options.headers && options.headers['Authorization'] !== undefined) {
          // 无权限访问
          store.dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
            type: 'danger', headline: '访问被拒绝', message: '您没有权限进行该操作'
          } })
        } else {
          // 未登录
          store.dispatch({ type: '@@xadmin/AUTH_SIGN_OUT_FINISH' })
        }
      }
      if (status < 200 || status >= 300) {
        let message = body || statusText
        if(json && json.error && json.error.message) {
          message = json.error.message
        }
        if(status == 422) {
          // 表单内容错误
          json = json.error.details.messages
        }
        return Promise.reject({ message, status, headers, json })
      }
      return { status, headers, body, json }
    })
}

export default (model) => {
  const host = 'http://tmis.top:9930/api'
  let headers = () => {
    const { store } = app.context
    const user = store != undefined ? store.getState().user : null
    const hs = {
      'Content-Type': 'application/json'
    }
    if( user && user.id ) {
      hs['Authorization'] = user.id
    }
    return hs
  }
  let resource = model.resource_name || model.name
  // cnvert for auth app
  if(resource == 'auth/login') {
    resource = 'users/login'
  } else if (resource == 'auth/logout') {
    resource = 'users/logout'
  } else if (resource == 'user/password') {
    resource = 'users/change-password'
  }
  return {
    host,
    headers,
    count(where) {
      let filter_string = encodeURIComponent(JSON.stringify(where))
      return fetch(`${host}/${resource}/count?where=${filter_string}`, {
        headers: headers()
      }).then(({ json }) => {
        return json['count']
      })
    },
    convert(filter) {
      const f = _.cloneDeep(filter)
      if (f.order !== undefined) {
        let order = []
        for (let k in f.order) {
          let o = f.order[k]
          if (o) {
            order.push(`${k} ${o}`)
          }
        }
        if (order.length > 1) {
          f.order = order
        } else {
          f.order = order[0]
        }
      }
      if (f.fields !== undefined) {
        let fields = [ 'id' ]
        const include = []
        for (let field of f.fields) {
          const property = model.properties ? model.properties[field] : null
          if(property) {
            if(property.type == 'object' && property.name != undefined) {
              include.push(field)
              fields.push(field)
            } else if(property.type == 'array' && property.items.type == 'object') {
              include.push(field)
            } else {
              fields.push(field)
            }
          }
        }
        f.fields = fields
        if(include.length == 1) {
          f.include = include[0]
        } else if(include.length > 1) {
          f.include = include
        }
      }
      if(f.limit == null) {
        delete f.limit
      }
      delete f.fields
      return f
    },
    convert_value(value) {
      if(_.isPlainObject(value)) {
        let vs = _.omit(value, 'rule')

        if(vs.gte && vs.lte) {
          vs = { between: [ vs.gte, vs.lte ], ..._.omit(vs, [ 'gte', 'lte' ]) }
        } else if(vs.like && vs.like.indexOf('%') == -1) {
          vs = { ...vs, like: `%${vs.like}%` }
        }

        return Object.keys(vs).reduce((prve, key) => {
          prve[key] = this.convert_value(vs[key])
          return prve
        }, {})

      } else if(_.isArray(value)) {
        return value.map(this.convert_where_value.bind(this))
      } else {
        return value
      }
    },
    convert_where_value(where) {
      return _.isPlainObject(where) ? Object.keys(where).reduce((prev, key) => {
        // 关联数据加上Id
        let fieldKey = _.camelCase(key)
        const property = model.properties ? model.properties[fieldKey] : null
        if(property && property.type == 'object' && property.name != undefined) {
          fieldKey = fieldKey + 'Id'
        }
        prev[fieldKey] = this.convert_value(where[key])
        return prev
      }, {}) : where
    },
    convert_where(wheres) {
      let where = _.values(wheres).map(w=>this.convert_where_value(w))
      if(where.length > 0) {
        if(where.length > 1) {
          where = { and: where }
        } else {
          where = where[0]
        }
      } else {
        where = {}
      }
      return where
    },
    query(filter = {}, wheres = {}) {
      const self = this
      const where = this.convert_where(wheres)
      return new Promise(function (resolve, reject) {
        self.count(where).then(total => {
          const f = self.convert(filter)
          if(Object.keys(where).length > 0) {
            f['where'] = where
          }
          let filter_string = encodeURIComponent(JSON.stringify(f))
          fetch(`${host}/${resource}?filter=${filter_string}`, {
            method: 'GET',
            headers: headers()
          }).then(({ json }) => {
            resolve({ items: json, total })
          }).catch(err=>{
            reject(err)
          })
        }).catch(err=>{
          reject(err)
        })
      })
    },
    get(id = '') {
      if(resource == 'auth' && id == 'user') {
        resource = 'users'
        id = 'me'
      }
      let filter = ''
      let include = []
      if(model.relations && Object.keys(model.relations).length > 0) {
        include = [ ...include, ...Object.keys(model.relations) ]
      }
      // for(let field in model.properties) {
      //   const property = model.properties[field]
      //   if(!property.notInclude && include.indexOf(field) == -1) {
      //     if(property.type == 'object' && property.name != undefined) {
      //       include.push(field)
      //     } else if(property.type == 'array' && property.items.type == 'object') {
      //       include.push(field)
      //     }
      //   }
      // }
      if(include.length) {
        filter = encodeURIComponent(JSON.stringify({ include }))
      }
      return fetch(`${host}/${resource}/${id}?filter=${filter}`, {
        method: 'GET',
        headers: headers()
      }).then(({ json }) => {
        if(id == 'me' && resource == 'users') {
          return _.omit(json, 'id')
        } else {
          return { ...json, id }
        }
      })
    },
    delete(id) {
      return fetch(`${host}/${resource}/${id}`, {
        method: 'DELETE',
        headers: headers()
      })
    },
    convert_data(data) {
      Object.keys(data).forEach(key => {
        if(_.isPlainObject(data[key]) && data[key].id !== undefined) {
          data[key+'Id'] = data[key].id
        }
      })
      return data
    },
    save(data={}, partial=false) {
      if(model.partialSave) {
        partial = true
      }
      if(resource == 'users/change-password') {
        data = {
          oldPassword: data['old_password'],
          newPassword: data['new_password']
        }
      }
      if (data.id) {
        const id = data.id
        return fetch(`${host}/${resource}/${id}`, {
          method: partial ? 'PATCH' : 'PUT',
          body: JSON.stringify(this.convert_data(_.omit(data, 'id'))),
          headers: headers()
        }).then(({ json }) => (json ? { ...data, ...json, id } : data))
      } else {
        return fetch(`${host}/${resource}`, {
          method: 'POST',
          body: JSON.stringify(this.convert_data(data)),
          headers: headers()
        }).then(({ json }) => json)
      }
    }
  }
}
