import React from 'react'
import _ from 'lodash'
import { C } from 'xadmin-ui'
import { use } from 'xadmin'
import * as atoms from './atoms'
import {
  useRecoilState, atom,
  useRecoilValue, useSetRecoilState, useRecoilCallback
} from 'recoil'

const search = atom({
  key: 'search', default: null
})

export default {
  name: 'xadmin.model.search',
  blocks: {
    'model.list.nav': (props) => <C is="Model.SearchBar" key="searchBar" {...props} />
  },
  hooks: {
    'model.searchbar': props => {
      const [ searchValue, setSearch ] = useRecoilState(search)
      const { model } = use('model')
      const { getItems } = use('model.getItems')

      const searchFields = model.searchFields
      const searchTitles = model.searchFields && model.searchFields.map(field => model.properties[field].title || field)

      const onSearch = useRecoilCallback(({ snapshot, set }) => (search) => {
        let wheres = { ...(snapshot.getLoadable(atoms.wheres).contents || {}) }
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
        getItems({ wheres: { ...wheres }, skip: 0 })
        setSearch(search)
      }, [ model.searchFields, setSearch ])

      return { ...props, searchValue, searchFields, searchTitles, onSearch }
    }
  }
}
