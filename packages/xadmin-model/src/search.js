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
    'model.searchbar': () => {
      const [ searchValue, setSearch ] = React.useState(null)
      const setSearchFilter = use('model.setter', 'where', 'searchbar')

      const { model } = use('model')

      const searchFields = model.searchFields
      const searchTitles = model.searchFields && model.searchFields.map(field => model.properties[field].title || field)

      const onSearch = React.useCallback((search) => {
        if(search) {
          const searchs = model.searchFields.map(field => {
            return { [field]: { like: search } }
          })
          if(searchs.length > 1) {
            setSearchFilter({ or: searchs })
          } else if(searchs.length > 0) {
            setSearchFilter(searchs[0])
          }
        } else {
          setSearchFilter(null)
        }
        setSearch(search)
      }, [ model.searchFields, setSearch, setSearchFilter ])

      return { searchValue, searchFields, searchTitles, onSearch }
    }
  }
}
