import React from 'react'
import { Icon } from '../../components'
import { Link } from 'react-router'
import { Pagination } from 'react-bootstrap'
import { Block } from '../../index'
import { ModelMixin } from '../base'
import _ from 'lodash'

const ModelPagination = React.createClass({
  mixins: [ModelMixin],

  propTypes: {
    bsSize: React.PropTypes.string
  },

  getStateMap (state) {
    const count = state.count
    const { limit, skip } = state.filter
    
    return {
      items: Math.ceil(count / limit),
      activePage: Math.floor(skip / limit) + 1
    }
  },

  onChangePage (page, e) {
    e.preventDefault()

    const state = this.getModelState()
      , pageSize = state.filter.limit
      , skip = pageSize * (page - 1)

    this.dispatch({ type: 'GET_ITEMS', filter: { ...state.filter, skip: skip }})
  },

  render() {
    if(this.state.items > 1) {
      return <Pagination
            style={{marginTop: 0}}
            bsSize={this.props.bsSize}
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={this.state.items}
            activePage={this.state.activePage}
            onSelect={this.onChangePage}
            maxButtons={5} />
    } else {
      return (
        <ul style={{marginTop:0}} className='pagination pagination-sm'>
          <li className='disabled'><a>无分页</a></li>
        </ul>
        )
    }
  }

})

module.exports = ModelPagination
