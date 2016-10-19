
export default {
  'model.list.pagination': {
    data: ({ modelState }) => {
      const count = modelState.count
      const { limit, skip } = modelState.filter
      
      return {
        items: Math.ceil(count / limit),
        activePage: Math.floor(skip / limit) + 1
      }
    },
    method: {
      changePage: ({ dispatch, modelState, model }) => (page) => {
        const pageSize = modelState.filter.limit
          , skip = pageSize * (page - 1)
        dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter, skip: skip } })
      }
    }
  }
}
