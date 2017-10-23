import fetch from 'isomorphic-fetch'
import { app } from '../index'

export default (url, options = {}) => {
  let status, statusText, headers = {}, body, json

  return fetch(url, options)
    .then(response => {
      if(response.headers && response.headers.entries) {
        for (let pair of response.headers.entries()) {
          headers[pair[0]] = pair[1]
        }
      } else {
        headers = response.headers
      }
      status = response.status
      statusText = response.statusText
      return response
    })
    .then(response => response.text())
    .then(text => {
      body = text
      try {
        json = JSON.parse(text)
      } catch (e) {
        // not json, no big deal
      }
      if (status == 401) {
        const { store } = app.context
        store.dispatch({ type: '@@xadmin/AUTH_SIGN_OUT_FINISH' })
      }
      if (status < 200 || status >= 300) {
        return Promise.reject({ message: body || statusText, status, headers, json })
      }
      return { status, headers, body, json }
    })
}
