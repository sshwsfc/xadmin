import React from 'react'
import _ from 'lodash'
import { C } from 'xadmin-ui'
import { use } from 'xadmin'

export default {
  name: 'xadmin.model.search',
  blocks: {
    'model.list.nav': (props) => <C is="Model.SearchBar" key="searchBar" {...props} />
  },
  hooks: {
    'model.searchbar': props => {
      const { model, searchValue, state, dispatch } = use('model', props, state => ({
        searchValue: state.filter.search
      }))
      const searchFields = model.searchFields
      const searchTitles = model.searchFields && model.searchFields.map(field => model.properties[field].title || field)

      const onSearch = React.useCallback((search) => {
        let wheres = state.wheres || {}
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
        dispatch({ type: 'GET_ITEMS', filter: { ...state.filter, skip: 0, search }, wheres })
      }, [ model.searchFields, dispatch, state.wheres, state.filter ])

      return { ...props, searchValue, searchFields, searchTitles, onSearch }
    }
  }
}
