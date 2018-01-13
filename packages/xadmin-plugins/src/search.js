import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Navbar, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { Block, StoreWrap, app } from 'xadmin'
import { ModelWrap } from 'xadmin-model'

@ModelWrap('model.searchbar')
class SearchBar extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = { value: props.searchValue }
  }

  onSearch(e) {
    if(this.state.value) {
      this.props.onSearch(this.state.value)
    }
  }

  onClean(e) {
    this.setState({ value: '' })
    this.props.onSearch('')
  }

  render() {
    const { _t } = app.context
    const { searchValue, searchTitles } = this.props
    if(searchTitles && searchTitles.length > 0) {
      const placeholder = _t('Search') + ' ' + searchTitles.join(', ')
      return (
        <Navbar.Form pullLeft>

          <InputGroup>
            <FormControl ref="searchInput" value={this.state.value} type="text" placeholder={placeholder} onChange={(e)=>{this.setState({ value: e.target.value })}} />
            <InputGroup.Button>
              { searchValue ? <Button onClick={this.onClean.bind(this)}><Icon name="times" /></Button> : null }
              <Button onClick={this.onSearch.bind(this)} type="submit"><Icon name="search" /></Button>
            </InputGroup.Button>
          </InputGroup>

        </Navbar.Form>
      )
    }
    return null
  }

}

export default {
  name: 'xadmin.model.search',
  blocks: {
    'model.list.nav': (props) => <SearchBar {...props} />
  },
  mappers: {
    'model.searchbar': {
      data: ({ model, modelState }) => {
        return {
          searchFields: model.search_fields,
          searchValue: modelState.filter.search
        }
      },
      compute: ({ model, modelState }) => {
        return {
          searchTitles: model.search_fields && model.search_fields.map(field => model.properties[field].title || field)
        }
      },
      method: {
        onSearch: ({ dispatch, model, modelState }) => (search) => {
          let wheres = modelState.wheres || {}
          if(search) {
            const searchs = model.search_fields.map(field => {
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
export { SearchBar }
