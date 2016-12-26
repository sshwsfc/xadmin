import React from 'react'
import _ from 'lodash'
import { Navbar, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'
import { ModelWrap } from '../model/base'
import { Icon } from '../components'

const SearchBar = ModelWrap('model.searchbar')(React.createClass({

  propTypes: {
    searchFields: React.PropTypes.array,
    searchValue: React.PropTypes.string,
    onSearch: React.PropTypes.object
  },

  getInitialState() {
    return { value: this.props.searchValue }
  },

  onSearch(e) {
    e.preventDefault()
    this.props.onSearch(this.state.value)
  },

  render() {
    const { searchFields, searchValue } = this.props
    if(searchFields && searchFields.length > 0) {
      const placeholder = 'Search ' + searchFields.join(', ')
      return (
        <Navbar.Form pullLeft>
          <form onSubmit={this.onSearch}>

          <InputGroup>
            <FormControl ref="searchInput" value={this.state.value} type="text" placeholder={placeholder} onChange={(e)=>{this.setState({ value: e.target.value })}} />
            <InputGroup.Button>
              <Button type="submit"><Icon name="search" /></Button>
            </InputGroup.Button>
          </InputGroup>

          </form>
        </Navbar.Form>
      )
    }
    return null
  }

}))

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
          dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter, skip: 0 }, wheres })
        }
      }
    }
  }
}
