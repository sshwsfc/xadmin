import fetch from 'isomorphic-fetch'
import { RESTBaseAPI } from 'xadmin'

export default class API extends RESTBaseAPI {

  getHost() {
    return 'https://jsonplaceholder.typicode.com/'
  }

  fetch(id, options) {
    return fetch(this.getHost() + this.resource + (id ? ('/' + id) : '') , options).then((resp) => {
      return resp.json()
    }).catch(console.error)
    //return new Promise((resolve, reject) => { reject({ json: { name: 'User Name error' }})})
  }

  save(data = {}, partial = false) {
    if (this.resource == 'auth/logout') {
      return new Promise((resolve, reject) => resolve({}))
    }
    if (this.resource == 'auth/login') {
      return new Promise((resolve, reject) => resolve({ token: '123' }))
    }
    return super.save(data, partial)
  }
}
