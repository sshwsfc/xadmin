import { combineReducers } from 'redux'
import {
  RECEIVE_ITEMS, SELECT_ITEMS, DELETED_ITEM
} from './actions'

let modelItems = (model) => (state = [], action) => {
  switch (action.type) {
    case RECEIVE_ITEMS:
      return action.items
    default:
      return state
  }
}

let modelSelectdItems = (model) => (state = [], action) => {
  switch (action.type) {
    case SELECT_ITEMS:
      let selectedItems = state.filter(item => { return item.id !== action.item.id })
      if (action.selected) {
        selectedItems.push(action.item)
      }
      return selectedItems
    case DELETED_ITEM:
      return state.filter(item => { return item.id !== action.item.id })
    default:
      return state
  }
}

let modelFilter = (model) => (state = {limit: 50, skip: 0}, action) => {
  switch (action.type) {
    case RECEIVE_ITEMS:
      return action.filter
    default:
      return state
  }
}

let modelCount = (model) => (state = 0, action) => {
  switch (action.type) {
    case RECEIVE_ITEMS:
      return action.count
    default:
      return state
  }
}

const rootReducer = combineReducers({
  items: modelItems('car'),
  selected: modelSelectdItems('car'),
  filter: modelFilter('car'),
  count: modelCount('car')
})

export default rootReducer
