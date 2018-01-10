import _ from 'lodash'

export default (model) => ({
  count(filter = {}) {
    return new Promise((slove) => slove(2))
  },
  query(filter = {}, wheres = {}) {
    return new Promise((slove) => slove({ 
      total: 2, 
      items: [
        { id: 1, name: 'TOM', email: '2302222@qq.com' },
        { id: 2, name: 'JERRY', email: '12131313@qq.com' }
      ] }))
  },
  get(id = '') {
    return new Promise((slove) => slove({ id: 1, name: 'TOM', email: '2302222@qq.com' }))
  },
  delete(id) {
    return new Promise((slove) => slove({}))
  },
  save(data) {
    return new Promise((slove) => slove(data))
  }
})
