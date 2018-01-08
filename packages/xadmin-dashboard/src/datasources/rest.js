import fetch from 'xadmin/lib/api/fetch'

const query = ({ url }, params) => {
  return fetch.get(url)
}

export default {
  name: 'REST API',
  query
}
