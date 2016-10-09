import CryptoJS from 'crypto-js'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'

module.exports = (model) => {
  let headers = () => {
    let now = Date.now()
    let appKey = CryptoJS.SHA1('A6902408240122UZ5509984D-0109-C69E-FBC2-BE7885A75CE8UZ' + now) + '.' + now

    return {
      'Content-Type': 'application/json',
      'X-APICloud-AppId': 'A6902408240122',
      'X-APICloud-AppKey': appKey
    }
  }
  return {
    count(filter = {}) {
      let filter_string = encodeURIComponent(JSON.stringify({ where: filter['where'] || {} }))
      return fetch(`https://d.apicloud.com/mcm/api/${model}/count?filter=${filter_string}`, {
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
        for (let field of f.fields) {
          fields[field] = true
        }
        f.fields = fields
      }
      return f
    },
    query(filter = {}) {
      if (filter['limit'] === undefined) {
        filter['limit'] = 50
      }
      let filter_string = encodeURIComponent(JSON.stringify(this.convert(filter)))
      return fetch(`https://d.apicloud.com/mcm/api/${model}?filter=${filter_string}`, {
        headers: headers()
      }).then((resp) => {
        return resp.json()
      })
    },
    get(id = '') {
      return fetch(`https://d.apicloud.com/mcm/api/${model}/${id}`, {
        headers: headers()
      }).then((resp) => {
        return resp.json()
      })
    },
    delete(id) {
      return fetch(`https://d.apicloud.com/mcm/api/${model}/${id}`, {
        method: 'DELETE',
        headers: headers()
      }).then((resp) => {
        return resp.json()
      })
    },
    save(data) {
      if (data.id) {
        let id = data.id
        return fetch(`https://d.apicloud.com/mcm/api/${model}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: headers()
        }).then((resp) => {
          return resp.json()
        })
      } else {
        return fetch(`https://d.apicloud.com/mcm/api/${model}`, {
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
