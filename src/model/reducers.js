
import _ from 'lodash'
import { combineReducers } from 'redux'

const cacheDuration = 10 * 60 * 1000 // ten minutes

const addRecords = (newRecords = [], oldRecords) => {
  // prepare new records and timestamp them
  const newRecordsById = newRecords.reduce((prev, record) => {
    prev[record.id] = record
    return prev
  }, {})
  const now = new Date()
  const newRecordsFetchedAt = newRecords.reduce((prev, record) => {
    prev[record.id] = now
    return prev
  }, {})
  // remove outdated old records
  const latestValidDate = new Date()
  latestValidDate.setTime(latestValidDate.getTime() - cacheDuration)
  const oldValidRecordIds = Object.keys(oldRecords.fetchedAt)
    .filter(id => oldRecords.fetchedAt[id] > latestValidDate)
  const oldValidRecords = oldValidRecordIds.reduce((prev, id) => {
    prev[id] = oldRecords[id]
    return prev
  }, {})
  const oldValidRecordsFetchedAt = oldValidRecordIds.reduce((prev, id) => {
    prev[id] = oldRecords.fetchedAt[id]
    return prev
  }, {})
  // combine old records and new records
  const records = {
    ...oldValidRecords,
    ...newRecordsById
  }
  Object.defineProperty(records, 'fetchedAt', { value: {
    ...oldValidRecordsFetchedAt,
    ...newRecordsFetchedAt
  } })
  return records
}

const initialState = {}
Object.defineProperty(initialState, 'fetchedAt', { value: {} })

export default (model) => {
  return {
    items: (model) => (state = initialState, action) => {
      if(!action.model || action.model.name != model.name) return state

      switch (action.type) {
        case 'GET_ITEMS':
          return action.items != undefined ? addRecords(action.items, state) : state
        case 'GET_ITEM':
          return action.success === true ? addRecords([ action.item ], state) : state
        case 'SAVE_ITEM':
          return action.success === true ? addRecords([ action.item ], state) : state
        default:
          return state
      }
    },
    ids: (model) => (state = [], action) => {
      if(!action.model || action.model.name != model.name) return state

      switch (action.type) {
        case 'GET_ITEMS':
          return action.items != undefined ? action.items.map(record => record.id) : state
        default:
          return state
      }
    },
    selected: (model) => (state = [], action) => {
      if(!action.model || action.model.name != model.name) return state

      switch (action.type) {
        case 'SELECT_ITEMS': {
          let selectedItems = state.filter(item => { return item.id !== action.item.id })
          if (action.selected) {
            selectedItems.push(action.item)
          }
          return selectedItems
        }
        default:
          return state
      }
    },
    filter: (model) => (state = { fields: [].concat(model.list_display), limit: 15, skip: 0 }, action) => {
      if(!action.model || action.model.name != model.name) return state

      switch (action.type) {
        case 'UPDATE_FILTER':
          return { ...state, ...action.payload }
        case 'GET_ITEMS':
          return action.items && action.filter || state
        default:
          return state
      }
    },
    wheres: (model) => (state = {}, action) => {
      if(!action.model || action.model.name != model.name) return state

      switch (action.type) {
        case 'UPDATE_WHERE':
          if(action.payload) {
            return { ...state, [action.key]: action.payload }
          } else {
            return _.omit(state, action.key)
          }
        case 'GET_ITEMS':
          return action.items && action.wheres || state
        default:
          return state
      }
    },
    count: (model) => (state = 0, action) => {
      if(!action.model || action.model.name != model.name) return state

      switch (action.type) {
        case 'GET_ITEMS':
          return action.count === undefined ? state : action.count
        default:
          return state
      }
    },
    form: (model) => (state = { loading: false, saveing: false }, action) => {
      if(!action.model || action.model.name != model.name) return state

      switch (action.type) {
        case 'GET_ITEM':
          return { ...state, loading: action.success !== true }
        case 'SAVE_ITEM':
          return { ...state, saveing: action.success !== true }
        default:
          return state
      }
    }
  }
}
