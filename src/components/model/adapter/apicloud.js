import CryptoJS from 'crypto-js'
import fetch from 'isomorphic-fetch'

module.exports = (model) => {
  let headers = () => {
    var now = Date.now()
    var appKey = CryptoJS.SHA1('A6902408240122UZ5509984D-0109-C69E-FBC2-BE7885A75CE8UZ' + now) + '.' + now

    return {
      'Content-Type': 'application/json',
      'X-APICloud-AppId': 'A6902408240122',
      'X-APICloud-AppKey': appKey
    }
  }
  return {
    count (filter = {}) {
      var filter_string = encodeURIComponent(JSON.stringify({where: filter['where'] || {}}))
      return fetch(`https://d.apicloud.com/mcm/api/${model}/count?filter=${filter_string}`, {
        headers: headers()
      }).then((resp) => {
        return resp.json()
      }).then(data => {
        return data['count']
      })
    },
    query (filter = {}) {
      if (filter['limit'] === undefined) {
        filter['limit'] = 50
      }
      var filter_string = encodeURIComponent(JSON.stringify(filter))
      return fetch(`https://d.apicloud.com/mcm/api/${model}?filter=${filter_string}`, {
        headers: headers()
      }).then((resp) => {
        return resp.json()
      })
    },
    get (id = '') {
      return fetch(`https://d.apicloud.com/mcm/api/${model}/${id}`, {
        headers: headers()
      }).then((resp) => {
        return resp.json()
      })
    },
    delete (id) {
      return fetch(`https://d.apicloud.com/mcm/api/${model}/${id}`, {
        method: 'DELETE',
        headers: headers()
      }).then((resp) => {
        return resp.json()
      })
    },
    save (data) {
      if (data.id) {
        var id = data.id
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
