import { combineReducers } from 'redux'
import {
  RECEIVE_ITEMS, SELECT_ITEMS, DELETED_ITEM
} from './actions'

export default combineReducers({
  items (state = [], action) {
    switch (action.type) {
      case RECEIVE_ITEMS:
        return action.items
      default:
        return state
    }
  },
  selected (state = [], action) {
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
  },
  filter (state = {}, action) {
    switch (action.type) {
      case RECEIVE_ITEMS:
        return action.filter
      default:
        return state
    }
  },
  count (state = 0, action) {
    switch (action.type) {
      case RECEIVE_ITEMS:
        return action.count
      default:
        return state
    }
  }
})
