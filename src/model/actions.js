
import _ from 'lodash'
import adapter from './adapter/apicloud'

const MODEL = 'car'
const api = adapter(MODEL)

export const REQUEST_ITEMS = 'REQUEST_ITEMS'
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
export const DELETED_ITEM = 'DELETED_ITEM'
export const SELECT_ITEMS = 'SELECT_ITEMS'

function requestItems (filter) {
  return {
    type: REQUEST_ITEMS,
    filter
  }
}

function receiveItems (filter, items, count) {
  return {
    type: RECEIVE_ITEMS,
    filter,
    count,
    items
  }
}

export function fetchItems (filter) {
  return (dispatch, getState) => {
    const newFilter = Object.assign({}, getState().filter, filter)
    dispatch(requestItems(newFilter))
    api.count(newFilter).then(count => {
      api.query(newFilter).then(items => {
        dispatch(receiveItems(newFilter, items, count))
      })
    })
  }
}

export function deleteItem (item) {
  return (dispatch) => {
    api.delete(item.id).then(res => {
      dispatch({
        type: DELETED_ITEM,
        item
      })
      dispatch(fetchItems({}))
    })
  }
}

export function selecteItem (item, selected) {
  return {
    type: SELECT_ITEMS,
    item,
    selected
  }
}

export function changeOrder (field, order) {
  return (dispatch, getState) => {
    const orders = getState().filter.order || {}
    orders[field] = order
    return dispatch(fetchItems({order: orders}))
  }
}

export function changeField (field, select) {
  return (dispatch, getState) => {
    const fields = [].concat(getState().filter.fields || [])
    const index = _.indexOf(fields, field)
    if (select) {
      if (index === -1) fields.push(field)
    } else {
      _.remove(fields, (i) => { return i === field })
    }
    return dispatch(fetchItems({fields}))
  }
}
