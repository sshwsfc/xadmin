import React from 'react'
import _ from 'lodash'
import { Input } from 'antd'
import app from 'xadmin'
import { ModelWrap } from 'xadmin-model'

@ModelWrap('model.searchbar')
class SearchBar extends React.Component {

  render() {
    const { _t } = app.context
    const { onSearch, searchTitles } = this.props
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

} 
export default SearchBar
