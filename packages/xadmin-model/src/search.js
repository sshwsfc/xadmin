import React from 'react'
import _ from 'lodash'
import { C } from 'xadmin-ui'

export default {
  name: 'xadmin.model.search',
  blocks: {
    'model.list.nav': (props) => <C is="Model.SearchBar" key="searchBar" {...props} />
  },
  mappers: {
    'model.searchbar': {
      data: ({ model, modelState }) => {
        return {
          searchFields: model.searchFields,
          searchValue: modelState.filter.search
        }
      },
      compute: ({ model, modelState }) => {
        return {
          searchTitles: model.searchFields && model.searchFields.map(field => model.properties[field].title || field)
        }
      },
      method: {
        onSearch: ({ dispatch, model, modelState }) => (search) => {
          let wheres = modelState.wheres || {}
          if(search) {
            const searchs = model.searchFields.map(field => {
              return { [field]: { like: search } }
            })
            if(searchs.length > 1) {
              wheres['searchbar'] = { or: searchs }
            } else if(searchs.length > 0) {
              wheres['searchbar'] = searchs[0]
            }
          } else {
            wheres = _.omit(wheres, 'searchbar')
          }
          dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter, skip: 0, search }, wheres })
        }
      }
    }
  }
}
