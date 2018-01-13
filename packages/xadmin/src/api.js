
export default class RESTBaseAPI {

  constructor(options) {
    this.options = options
    this.resource = options.resource_name || options.name
  }

  getHost() {
    return '/'
  }

  fetch(id, options) {
    throw 'App API not implement!!!'
  }

  count(where = {}) {
    return this.fetch().then(ds => ds.length)
  }

  query(filter = {}, wheres = {}) {
    return this.fetch().then(ds => ({
      total: ds.length, items: ds.slice(filter.skip || 0, (filter.skip || 0) + parseInt(filter.limit || 15))
    }))
  }

  get(id = '') {
    return this.fetch(id)
  }

  delete(id) {
    return this.fetch(id, { method: 'DELETE' })
  }

  save(data) {
    if (data.id) {
      let id = data.id
      return this.fetch(id, { method: 'PUT', body: JSON.stringify(data) }).then((item) => {
        return { ...data, ...item }
      })
    } else {
      return this.fetch(null, { method: 'POST', body: JSON.stringify(data) }).then((item) => {
        return { ...data, ...item }
      })
    }
  }
}
