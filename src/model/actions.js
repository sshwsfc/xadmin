
import adapter from './adapter/apicloud'

const MODEL = 'car'
const api = adapter(MODEL)

export const REQUEST_ITEMS = 'REQUEST_ITEMS'
function requestItems (filter) {
  return {
    type: REQUEST_ITEMS,
    model: MODEL,
    filter
  }
}

export const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
function receiveItems (filter, items, count) {
  return {
    type: RECEIVE_ITEMS,
    model: MODEL,
    filter,
    count,
    items
  }
}

export function fetchItems (filter) {
  return (dispatch, getState) => {
    const newFilter = Object.assign({}, getState().models$car$filter, filter)
    dispatch(requestItems(newFilter))
    api.count(newFilter).then(count => {
      api.query(newFilter).then(items => {
        dispatch(receiveItems(newFilter, items, count))
      })
    })
  }
}

export const DELETED_ITEM = 'DELETED_ITEM'
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

export const SELECT_ITEMS = 'SELECT_ITEMS'
export function selecteItem (item, selected) {
  return {
    type: SELECT_ITEMS,
    model: MODEL,
    item,
    selected
  }
}

export function changeOrder (field, order) {
  return (dispatch, getState) => {
    const orders = getState().models$car$filter.order || {}
    orders[field] = order
    return dispatch(fetchItems({order: orders}))
  }
}

