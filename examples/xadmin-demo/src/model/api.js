import fetch from 'isomorphic-fetch'
import { RESTBaseAPI } from 'xadmin'

export default class API extends RESTBaseAPI {

  getHost() {
    return 'http://10.0.0.80:9090/'
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

}
