import fetch from 'isomorphic-fetch'
import { RESTBaseAPI } from 'xadmin'
import _ from 'lodash'

export default class API extends RESTBaseAPI {

  constructor(options) {
    super(options)

    this.model = options

    this.host = this.getHost()
  }

  getHost() {
    return 'http://localhost:3000/'
  }

  fetch(id, options) {
    return fetch(this.getHost() + this.resource + (id ? ('/' + id) : '') , options == undefined || options.method == 'GET' ? options : {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      ...options
    }).then((resp) => {
      return resp.json()
    }).catch(console.error)
  }

  convert(filter) {
    const f = _.cloneDeep(filter)
    const fs = {}

    if (f.order !== undefined) {
      const _order = []
      const _sort = []
      for (let k in f.order) {
        let o = f.order[k]
        if (o) {
          _order.push(_.lowerCase(o))
          _sort.push(k)
        }
      }
      if (_order.length > 0 && _sort.length > 0) {
        fs['_order'] = _order.join(',')
        fs['_sort'] = _sort.join(',')
      }
    }
    if (f.fields !== undefined) {
      const _embed = []
      const _expand = []
      for (let field of f.fields) {
        const property = this.model.properties ? this.model.properties[field] : null
        if(property) {
          if(property.type == 'object' && property.name != undefined) {
            _expand.push(field)
          } else if(property.type == 'array' && property.items.type == 'object') {
            _embed.push(field)
          }
        }
      }
      if(_embed.length > 0) {
        fs['_embed'] = _embed.join(',')
      }
      if(_expand.length > 0) {
        fs['_expand'] = _expand.join(',')
      }
    }
    if(f.limit) {
      fs['_limit'] = parseInt(f.limit)
    }
    if(f.skip) {
      fs['_start'] = parseInt(f.skip)
    }
    return fs
  }

  convert_value(value) {
    if(_.isPlainObject(value)) {
      let vs = _.omit(value, 'rule')

      return Object.keys(vs).reduce((prve, key) => {
        prve[key] = this.convert_value(vs[key])
        return prve
      }, {})

    } else if(_.isArray(value)) {
      return value.map(this.convert_where_value.bind(this))
    } else {
      return value
    }
  }

  convert_where_value(where) {
    return _.isPlainObject(where) ? Object.keys(where).reduce((prev, key) => {
      // 关联数据加上Id
      let fieldKey = _.camelCase(key)
      const property = this.model.properties ? this.model.properties[fieldKey] : null
      if(property && property.type == 'object' && property.name != undefined) {
        fieldKey = fieldKey + 'Id'
      }
      const ops = this.convert_value(where[key])
      if(_.isPlainObject(ops)) {
        _.keys(ops).forEach(op => {
          prev[fieldKey + '_' + op] = ops[op]
        })
      } else {
        prev[fieldKey] = ops
      }
      return prev
    }, {}) : where
  }

  convert_where(wheres) {
    return _.values(wheres).reduce((prev, where) => {
      return { ...prev, ...this.convert_where_value(where) }
    }, {})
  }

  _query(filter = {}, wheres = {}) {
    const self = this
    const where = { ...this.convert_where(wheres), ...this.convert(filter) }
    return this.fetch('?' + _.keys(where).map(name => `${name}=${where[name]}`).join('&'))
      .then(({ json, headers }) => {
        return { items: json, total: parseInt(headers['x-total-count'] || json.length) }
      })
  }
}
