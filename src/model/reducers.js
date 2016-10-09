
export default (model) => {
  return {
    items: (model) => (state = [], action) => {
      if(!action.model || action.model.name != model.name) return state
      switch (action.type) {
        case 'GET_ITEMS':
          return action.items || state
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
    filter: (model) => (state = { fields: [].concat(model.list_display), limit: 50, skip: 0 }, action) => {
      if(!action.model || action.model.name != model.name) return state
      switch (action.type) {
        case 'GET_ITEMS':
          return action.items && action.filter || state
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
    }
  }
}
