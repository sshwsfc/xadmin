import CryptoJS from 'crypto-js'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'

export default (model) => {
  const host = 'http://127.0.0.1:3000'
  let headers = () => {
    return {
      'Content-Type': 'application/json'
    }
  }
  const resource = model.resource_name || model.name
  return {
    count(filter = {}) {
      let filter_string = encodeURIComponent(JSON.stringify({ where: filter['where'] || {} }))
      return fetch(`${host}/${resource}/count?filter=${filter_string}`, {
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
        f.order = order
      }
      if (f.fields !== undefined) {
        let fields = { id: true }
        for (let field of f.fields) {
          fields[field] = true
        }
        f.fields = fields
      }
      return f
    },
    convert_value(value) {
      if(_.isPlainObject(value)) {
        const { rule, ...vs } = value
        return vs
      } else {
        return { eq: value }
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
          where = where.reduce((prev, w) => {
            return { ...prev, ...w }
          }, {})
        } else {
          where = where[0]
        }
      } else {
        where = {}
      }
      return where
    },
    query(filter = {}, wheres = {}) {
      if (filter['limit'] === undefined) {
        filter['limit'] = 50
      }
      const where = this.convert_where(wheres)
      const f = this.convert(filter)
      f['where'] = where
      let filter_string = encodeURIComponent(JSON.stringify(f))
      return fetch(`${host}/${resource}?filter=${filter_string}`, {
        method: 'GET',
        headers: headers()
      }).then((resp) => {
        return resp.json()
      }).then(items => {
        return { total: 2, items }
      })
    },
    get(id = '') {
      return fetch(`${host}/${resource}/${id}`, {
        method: 'GET',
        headers: headers()
      }).then((resp) => {
        return resp.json()
      })
    },
    delete(id) {
      return fetch(`${host}/${resource}/${id}`, {
        method: 'DELETE',
        headers: headers()
      })
    },
    save(data) {
      if (data.id) {
        let id = data.id
        return fetch(`${host}/${resource}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: headers()
        }).then((resp) => {
          if(resp.body.length > 0) {
            return resp.json()
          } else {
            return data
          }
        })
      } else {
        return fetch(`${host}/${resource}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: headers()
        }).then((resp) => {
          return resp.json()
        })
      }
    }
  }
}
