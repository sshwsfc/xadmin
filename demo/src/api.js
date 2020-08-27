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

}
