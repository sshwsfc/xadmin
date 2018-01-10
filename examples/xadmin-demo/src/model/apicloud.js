import CryptoJS from 'crypto-js'
import _fetch from 'isomorphic-fetch'
import _ from 'lodash'

const handleErrors = (resp) => {
  if (resp.ok) {
    return resp
  }
  const error = new Error()
  error.status = resp.status
  throw error
}

const fetch = (url, init) => {
  return _fetch(url, init)
    .then(handleErrors)
}

export default (model) => {
  let headers = () => {
    let now = Date.now()
    let appKey = CryptoJS.SHA1('A6902408240122UZ5509984D-0109-C69E-FBC2-BE7885A75CE8UZ' + now) + '.' + now

    return {
      'Content-Type': 'application/json',
      'X-APICloud-AppId': 'A6902408240122',
      'X-APICloud-AppKey': appKey
    }
  }
  const resource = model.resource_name || model.name
  return {
    count(where = {}) {
      let filter_string = encodeURIComponent(JSON.stringify({ where }))
      return fetch(`https://d.apicloud.com/mcm/api/${resource}/count?filter=${filter_string}`, {
        headers: headers()
      }).then((resp) => {
        return resp.json()
      }).then(data => {
        return data['count']
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
        let fields = { id: true }
        const include = []
        for (let field of f.fields) {
          const property = model.properties[field]
          if(property) {
            if(property.type == 'object' && property.name != undefined) {
              include.push(field)
              fields[field] = true
            } else if(property.type == 'array' && property.items.type == 'object') {
              include.push(field)
            } else {
              fields[field] = true
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
      return f
    },
    convert_value(value) {
      if(_.isPlainObject(value)) {
        const { rule, ...vs } = value
        return vs
      } else {
        return value
      }
    },
    convert_where_value(where) {
      return Object.keys(where).reduce((prev, key) => {
        prev[key] = this.convert_value(where[key])
        return prev
      }, {})
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
          fetch(`https://d.apicloud.com/mcm/api/${resource}?filter=${filter_string}`, {
            headers: headers()
          }).then(resp => {
            return resp.json()
          }).then(items => {
            resolve({ items, total })
          }).catch(err=>{
            reject(err)
          })
        }).catch(err=>{
          reject(err)
        })
      })
    },
    get(id = '') {
      return this.query({ limit:1, fields: Object.keys(model.properties) }, { getFilter: { id } })
        .then(({ items }) => {
          return items.length > 0 ? items[0] : null
        })
      // return fetch(`https://d.apicloud.com/mcm/api/${resource}/${id}`, {
      //   headers: headers()
      // }).then((resp) => {
      //   return resp.json()
      // })
    },
    delete(id) {
      return fetch(`https://d.apicloud.com/mcm/api/${resource}/${id}`, {
        method: 'DELETE',
        headers: headers()
      }).then((resp) => {
        return resp.json()
      })
    },
    save(data) {
      if (data.id) {
        let id = data.id
        return fetch(`https://d.apicloud.com/mcm/api/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: headers()
        }).then((resp) => {
          return resp.json()
        }).then((item) => {
          return { ...data, ...item }
        })
      } else {
        return fetch(`https://d.apicloud.com/mcm/api/${resource}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: headers()
        }).then((resp) => {
          return resp.json()
        }).then((item) => {
          return { ...data, ...item }
        })
      }
    }
  }
}
