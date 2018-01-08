import { combineReducers } from 'redux'
import { REHYDRATE } from 'redux-persist/constants'
import _ from 'lodash'
import { Map } from 'immutable'

const findRelateCells = (cells, parentKey) => {
  return Object.keys(cells).reduce((prev, key) => {
    return cells[key].parent == parentKey ? [
      ...prev, ...findRelateCells(cells, key)
    ] : prev
  }, [ parentKey ])
}

const paramsReducer = (state={}, action) => {
  const { type, payload, params } = action
  switch(type) {
    case '@@x-dashboard/UPDATE_DASHBOARD':
      return params
    case REHYDRATE:
      return action.payload.dashboard.params
    default:
      return state
  }
}

const cellsReducer = (state={}, action) => {
  const { type, key, params, Container } = action
  switch(type) {
    case '@@x-dashboard/ADD_CELL': {
      const newState = { ...state, [key]: params }

      if(params.parent) {
        const parent = (Container && Container.CellReducer) ? Container.CellReducer(newState[params.parent], action) : newState[params.parent]
        newState[params.parent] = {
          ...parent, childrenCells: [ ...(parent.childrenCells || []), key ]
        }
      }
      return newState
    }
    case '@@x-dashboard/REMOVE_CELL': {
      const parentKey = state[key].parent
      const newState = _.omit(state, findRelateCells(state, key))

      if(parentKey) {
        const parent = (Container && Container.CellReducer) ? Container.CellReducer(newState[parentKey], action) : state[parentKey]
        newState[parentKey] = {
          ...parent, childrenCells: parent.childrenCells ? parent.childrenCells.filter(k => k !== key) : []
        }
      }
      return newState
    }
    case '@@x-dashboard/UPDATE_CELL':
      return {
        ...state, 
        [key]: params
      }
    case '@@x-dashboard/MERGE_CELL':
      return {
        ...state, 
        [key]: _.merge({}, state[key], params)
      }
    default:
      return state
  }
}

const layoutReducer = (state={}, { type, payload }) => {
  switch(type) {
    case '@@x-dashboard/ADD_CELL': 
      return {
        ...state,
        lg: [
          ...(state.lg || []),
          { i: payload.key, ...payload.layout }
        ]
      }
    case '@@x-dashboard/CHANGE_LAYOUTS':
      return payload || state
    default:
      return state
  }
}

const layoutsReducer = (state={}, action) => {
  switch(action.type) {
    case '@@x-dashboard/ADD_CELL': {
      const key = action.payload.params.layer
      return {
        ...state,
        [key] : layoutReducer(state[key], action)
      }
    }
    case '@@x-dashboard/CHANGE_LAYOUTS': {
      return {
        ...state,
        [action.key] : layoutReducer(action.key, action)
      }
    }
    default:
      return state
  }
}

const dataReducer = (state={}, action) => {
  switch(action.type) {
    // case '@@x-dashboard/ADD_CELL':
    //   if(action.payload.key) {
    //     return state.setIn( action.payload.key, action.payload.data )
    //   } else {
    //     return state
    //   }
    case '@@x-dashboard/UPDATE_DATA':
      if(action.data !== undefined) {
        const path = action.cell || action.key
        return { ..._.set(state, path, action.data) }
      } else if(action.payload !== undefined) {
        const keys = Object.keys(action.payload)
        if(keys.length == 1) {
          const path = keys[0]
          let value = action.payload[path]
          if(_.isPlainObject(value)) {
            value = _.mergeWith(_.get(state, path), value, (objValue, srcValue) => {
              if (_.isArray(objValue)) {
                return srcValue
              }
            })
          }
          return { ..._.set(state, path, value) }
        } else {
          return _.mergeWith(_.cloneDeep(state), action.payload, (objValue, srcValue) => {
            if (_.isArray(objValue)) {
              return srcValue
            }
          })
        }
        //return state.mergeDeepWith(action.payload)
      } else {
        return state
      }
    case '@@x-dashboard/UPDATE_ALL_DATA':
      return action.payload
    default:
      return state
  }
}

const endpointReducer = (state={}, action) => {
  switch(action.type) {
    case '@@x-dashboard/UPDATE_ENDPOINT':
      return action.payload
    default:
      return state
  }
}

const selectCellReducer = (state=null, action) => {
  if(action.type == '@@x-dashboard/SELECT_CELL') {
    return action.key
  } else if(action.type == '@@x-dashboard/TRIGGER_SELECT_CELL') {
    return (action.key && state != action.key) ? action.key : null
  } else if (action.type == '@@x-dashboard/REMOVE_CELL' && state == action.key) {
    return null
  }
  return state
}

const dashboardReducer = combineReducers({
  params: paramsReducer,
  cells: cellsReducer,
  selectCell: selectCellReducer,
  //layouts: layoutsReducer,
  data: dataReducer,
  endpoints: endpointReducer
})

export default {
  dashboard: (state={}, action) => {
    if(action.type == '@@x-dashboard/LOAD_DASHBOARD') {
      const cells = action.payload.cells || {}
      const ts = Object.keys(cells).reduce((prev, key) => {
        const cell = cells[key]
        if(cell.parent) {
          prev[cell.parent] = [ ...(prev[cell.parent] || []), key ]
        }
        return prev
      }, {})

      Object.keys(ts).forEach(key => {
        if(cells[key] && cells[key].childrenCells == undefined) {
          cells[key].childrenCells = ts[key]
        }
      })

      return { ...action.payload, cells }
    } else {
      return dashboardReducer(state, action)
    }
  }
}
