import React from 'react'
import _ from 'lodash'
import { Input } from 'antd'
import app, { use } from 'xadmin'

const SearchBar = props => {

  const { _t } = app.context
  const { onSearch, searchTitles } = use('model.searchbar', props)
  if(searchTitles && searchTitles.length > 0) {
    const placeholder = _t('Search') + ' ' + searchTitles.join(', ')
    return (
      <Input.Search
        placeholder={placeholder}
        onSearch={onSearch}
        style={{ width: 200 }}
      />
    )
  }
  return null
  
} 
export default SearchBar
